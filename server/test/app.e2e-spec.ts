import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma/prisma.service';

jest.setTimeout(60000);
describe('Portfolio API with isolated PostgreSQL', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let base: string;
  let token: string;
  let cookie: string;
  let projectId: string;
  let categoryId: string;
  let skillId: string;
  let userId: string;
  const origin = 'http://localhost:3000';
  async function call(
    path: string,
    method = 'GET',
    body?: unknown,
    auth = false,
    refreshCookie?: string,
  ) {
    const response = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        ...(auth ? { Authorization: 'Bearer ' + token } : {}),
        ...(refreshCookie ? { Cookie: refreshCookie } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      response,
      json: (await response.json()) as { data: any; message: string },
    };
  }
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0, '127.0.0.1');
    base = (await app.getUrl()) + '/api';
    prisma = app.get(PrismaService);
    const user = await prisma.user.create({
      data: {
        name: 'API test',
        email: 'backend-test@example.com',
        passwordHash: await bcrypt.hash('test-password', 10),
      },
    });
    userId = user.id;
    categoryId = (
      await prisma.category.create({
        data: { name: 'API test', slug: 'api-test' },
      })
    ).id;
    skillId = (
      await prisma.skill.create({ data: { name: 'Test React', level: 80 } })
    ).id;
  });
  afterAll(async () => {
    if (prisma) {
      await prisma.project.deleteMany({ where: { authorId: userId } });
      await prisma.media.deleteMany({ where: { uploadedBy: userId } });
      if (categoryId)
        await prisma.category.delete({ where: { id: categoryId } });
      if (skillId) await prisma.skill.delete({ where: { id: skillId } });
      await prisma.message.deleteMany({
        where: { email: 'sender@example.com' },
      });
      if (userId) await prisma.user.delete({ where: { id: userId } });
      await prisma.apiRateLimit.deleteMany();
    }
    if (app) await app.close();
  });
  it('provides the public CMS aggregate without authentication or credentials', async () => {
    const result = await call('/portfolio');
    expect(result.response.status).toBe(200);
    expect(result.response.headers.get('cache-control')).toBe('no-store');
    expect(result.json.data.profile.name).toEqual(expect.any(String));
    expect(result.json.data.timelines).toEqual([]);
    expect(result.json.data.projects).toEqual([]);
    expect(result.json.data.skills).toHaveLength(1);
    expect(JSON.stringify(result.json.data)).not.toContain('passwordHash');
  });

  it('logs in with private cookies and no credential hashes', async () => {
    const result = await call('/auth/login', 'POST', {
      email: 'backend-test@example.com',
      password: 'test-password',
    });
    expect(result.response.status).toBe(200);
    token = result.json.data.accessToken;
    cookie = result.response.headers.get('set-cookie')!.split(';')[0];
    expect(result.response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(result.response.headers.get('set-cookie')).toContain(
      'SameSite=Strict',
    );
    expect(result.response.headers.get('cache-control')).toContain('no-store');
    const profile = await call('/users/me', 'GET', undefined, true);
    expect(profile.json.data.passwordHash).toBeUndefined();
    expect(profile.json.data.refreshTokenHash).toBeUndefined();
    expect(profile.json.data.authVersion).toBeUndefined();
    expect(profile.response.headers.get('cache-control')).toContain('no-store');
    expect((await call('/health')).json.data.status).toBe('ok');
  });
  it('rejects missing/forged bearer tokens and incorrect credentials', async () => {
    for (const path of [
      '/users/me',
      '/projects/admin',
      '/messages',
      '/media',
    ]) {
      expect((await call(path)).response.status).toBe(401);
      const forged = await fetch(base + path, {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(forged.status).toBe(401);
    }
    expect(
      (await call('/users/me', 'GET', undefined, false, cookie)).response
        .status,
    ).toBe(401);
    for (const email of ['backend-test@example.com', 'unknown@example.com'])
      expect(
        (
          await call('/auth/login', 'POST', {
            email,
            password: 'wrong-password',
          })
        ).response.status,
      ).toBe(401);
  });
  it('creates drafts with explicit evidence, then publishes them', async () => {
    const result = await call(
      '/projects',
      'POST',
      {
        title: 'API test project',
        excerpt: 'Test',
        description: 'A real API fixture',
        categoryId,
        skills: [{ skillId, usageNote: 'Built the interface' }],
        technologies: ['React'],
      },
      true,
    );
    expect(result.response.status).toBe(201);
    projectId = result.json.data.id;
    expect((await call('/projects/' + projectId)).response.status).toBe(404);
    expect(
      (await call('/projects/slug/api-test-project')).response.status,
    ).toBe(404);
    expect((await call('/projects/admin')).response.status).toBe(401);
    expect(
      (await call('/projects/admin', 'GET', undefined, true)).json.data.some(
        (item: { id: string }) => item.id === projectId,
      ),
    ).toBe(true);
    const skills = await call('/skills');
    expect(
      skills.json.data.find((s: { id: string }) => s.id === skillId).projects,
    ).toEqual([]);
    expect(
      (
        await call(
          '/projects/' + projectId,
          'PATCH',
          { status: 'PUBLISHED' },
          true,
        )
      ).response.status,
    ).toBe(200);
    const publicProject = await call('/projects/slug/api-test-project');
    expect(publicProject.response.status).toBe(200);
    expect(publicProject.json.data.skills[0].usageNote).toBe(
      'Built the interface',
    );
    expect(
      (await call('/skills')).json.data.find(
        (s: { id: string }) => s.id === skillId,
      ).projects,
    ).toHaveLength(1);
    await call(
      '/projects/' + projectId,
      'PATCH',
      { title: 'Renamed project' },
      true,
    );
    expect(
      (await call('/projects/slug/api-test-project')).response.status,
    ).toBe(200);
  });
  it('validates data and protects the inbox', async () => {
    expect((await call('/messages')).response.status).toBe(401);
    expect(
      (
        await call('/messages', 'POST', {
          name: 'Sender',
          email: 'bad',
          message: 'short',
        })
      ).response.status,
    ).toBe(400);
    expect(
      (
        await call('/messages', 'POST', {
          name: 'Sender',
          email: 'sender@example.com',
          message: 'Please contact me about work',
          website: 'spam',
        })
      ).response.status,
    ).toBe(400);
    expect(
      (
        await call('/messages', 'POST', {
          name: 'Sender',
          email: 'sender@example.com',
          message: 'Please contact me about work',
        })
      ).json.data,
    ).toEqual({ received: true });
    const inbox = await call(
      '/messages?page=1&limit=10',
      'GET',
      undefined,
      true,
    );
    expect(inbox.json.data.total).toBeGreaterThan(0);
    const id = inbox.json.data.items[0].id;
    expect(
      (await call('/messages/' + id, 'PATCH', { status: 'READ' }, true)).json
        .data.status,
    ).toBe('READ');
    expect(
      (await call('/messages?limit=1000', 'GET', undefined, true)).response
        .status,
    ).toBe(400);
    expect(
      (await call('/skills', 'POST', { name: 'Invalid', level: 101 }, true))
        .response.status,
    ).toBe(400);
    expect(
      (await call('/projects/' + projectId, 'PATCH', { status: null }, true))
        .response.status,
    ).toBe(400);
  });
  it('streams the CV through the response interceptor with download headers', async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { resumeUrl: 'https://assets.example.com/cv.pdf' },
    });
    const realFetch = global.fetch;
    const mock = jest
      .spyOn(global, 'fetch')
      .mockImplementation((input, init) =>
        String(input).startsWith('https://assets.example.com/')
          ? Promise.resolve(new Response('%PDF-1.7 fixture'))
          : realFetch(input, init),
      );
    try {
      const pdf = await fetch(base + '/users/resume?download=true', {
        headers: { Origin: origin },
      });
      expect(pdf.status).toBe(200);
      expect(pdf.headers.get('content-type')).toContain('application/pdf');
      expect(pdf.headers.get('content-disposition')).toContain('attachment');
      expect(await pdf.text()).toBe('%PDF-1.7 fixture');
    } finally {
      mock.mockRestore();
    }
  });
  it('serializes concurrent cover changes in PostgreSQL', async () => {
    const ids: string[] = [];
    for (let n = 0; n < 2; n++) {
      const media = await prisma.media.create({
        data: {
          publicId: 'api-test-' + n,
          url: 'https://example.com/' + n + '.png',
          fileName: n + '.png',
          mimeType: 'image/png',
          type: 'IMAGE',
          size: 10,
          uploadedBy: userId,
        },
      });
      const item = await call(
        '/project-media',
        'POST',
        { projectId, mediaId: media.id },
        true,
      );
      expect(item.response.status).toBe(201);
      ids.push(item.json.data.id);
    }
    const results = await Promise.all(
      ids.map((id) =>
        call('/project-media/' + id, 'PATCH', { isCover: true }, true),
      ),
    );
    expect(results.map((result) => result.response.status)).toEqual([200, 200]);
    expect(
      await prisma.projectMedia.count({
        where: { projectId, isActive: true, isCover: true },
      }),
    ).toBe(1);
  });
  it('blocks cross-origin writes and refresh replay', async () => {
    const blocked = await fetch(base + '/auth/refresh', {
      method: 'POST',
      headers: { Origin: 'https://attacker.example', Cookie: cookie },
    });
    expect(blocked.status).toBe(403);
    const missingOrigin = await fetch(base + '/auth/refresh', {
      method: 'POST',
      headers: { Cookie: cookie },
    });
    expect(missingOrigin.status).toBe(403);
    const attempts = await Promise.all([
      call('/auth/refresh', 'POST', undefined, false, cookie),
      call('/auth/refresh', 'POST', undefined, false, cookie),
    ]);
    expect(attempts.map((item) => item.response.status).sort()).toEqual([
      200, 401,
    ]);
    const refreshed = attempts.find((item) => item.response.status === 200)!;
    expect(refreshed.response.status).toBe(200);
    expect(
      (await call('/auth/refresh', 'POST', undefined, false, cookie)).response
        .status,
    ).toBe(401);
    expect(
      (await call('/auth/logout', 'POST', undefined, false, cookie)).response
        .status,
    ).toBe(401);
    const currentCookie = refreshed.response.headers
      .get('set-cookie')!
      .split(';')[0];
    expect(
      (await call('/auth/logout', 'POST', undefined, false, currentCookie))
        .response.status,
    ).toBe(200);
    expect(
      (await call('/auth/refresh', 'POST', undefined, false, currentCookie))
        .response.status,
    ).toBe(401);
    expect(
      (await call('/users/me', 'GET', undefined, true)).response.status,
    ).toBe(401);
    const newerLogin = await call('/auth/login', 'POST', {
      email: 'backend-test@example.com',
      password: 'test-password',
    });
    const firstAccess = newerLogin.json.data.accessToken;
    const firstCookie = newerLogin.response.headers
      .get('set-cookie')!
      .split(';')[0];
    const latestLogin = await call('/auth/login', 'POST', {
      email: 'backend-test@example.com',
      password: 'test-password',
    });
    expect(
      (
        await fetch(base + '/users/me', {
          headers: { Authorization: 'Bearer ' + firstAccess },
        })
      ).status,
    ).toBe(401);
    expect(
      (await call('/auth/refresh', 'POST', undefined, false, firstCookie))
        .response.status,
    ).toBe(401);
    token = latestLogin.json.data.accessToken;
    expect(
      (await call('/users/me', 'GET', undefined, true)).response.status,
    ).toBe(200);
  });
  it('enforces persistent message throttling and reports retry time', async () => {
    let status = 0;
    let retry: string | null = null;
    for (let n = 0; n < 6; n++) {
      const result = await call('/messages', 'POST', {
        name: 'Sender',
        email: 'sender@example.com',
        message: 'A sufficiently long message',
      });
      status = result.response.status;
      retry = result.response.headers.get('retry-after');
    }
    expect(status).toBe(429);
    expect(Number(retry)).toBeGreaterThan(0);
    expect(
      (
        await call('/MESSAGES/', 'POST', {
          name: 'Sender',
          email: 'sender@example.com',
          message: 'A sufficiently long message',
        })
      ).response.status,
    ).toBe(429);
  });
  it('returns real dashboard counts without other owners or deleted projects', async () => {
    const other = await prisma.user.create({
      data: {
        name: 'Other owner',
        email: 'dashboard-other@example.com',
        passwordHash: 'unused-test-hash',
      },
    });
    let removedId: string | undefined;
    try {
      const otherProject = await prisma.project.create({
        data: {
          title: 'Other owner project',
          slug: 'other-owner-dashboard',
          excerpt: 'Fixture',
          description: 'Fixture',
          status: 'PUBLISHED',
          authorId: other.id,
          categoryId,
        },
      });
      const removed = await prisma.project.create({
        data: {
          title: 'Deleted fixture',
          slug: 'deleted-dashboard',
          excerpt: 'Fixture',
          description: 'Fixture',
          status: 'PUBLISHED',
          authorId: userId,
          categoryId,
          deletedAt: new Date(),
        },
      });
      removedId = removed.id;
      await prisma.media.create({
        data: {
          publicId: 'other-owner-media',
          url: 'https://assets.example.com/other.png',
          fileName: 'other.png',
          mimeType: 'image/png',
          type: 'IMAGE',
          size: 999999,
          uploadedBy: other.id,
        },
      });
      expect((await call('/dashboard/summary')).response.status).toBe(401);
      const result = await call('/dashboard/summary', 'GET', undefined, true);
      expect(result.response.status).toBe(200);
      expect(result.response.headers.get('cache-control')).toContain(
        'no-store',
      );
      const owned = { authorId: userId, deletedAt: null };
      expect(result.json.data.projects.total).toBe(
        await prisma.project.count({ where: owned }),
      );
      expect(result.json.data.projects.published).toBe(
        await prisma.project.count({
          where: { ...owned, status: 'PUBLISHED' },
        }),
      );
      const media = await prisma.media.aggregate({
        where: { uploadedBy: userId },
        _count: { _all: true },
        _sum: { size: true },
      });
      expect(result.json.data.media).toEqual({
        files: media._count._all,
        bytes: media._sum.size ?? 0,
      });
      expect(result.json.data.messages.total).toBe(
        await prisma.message.count(),
      );
      expect(result.json.data.messages.unread).toBe(
        await prisma.message.count({ where: { status: 'UNREAD' } }),
      );
      expect(result.json.data.content.skills).toBe(await prisma.skill.count());
      expect(
        result.json.data.recentProjects.map((item: { id: string }) => item.id),
      ).not.toContain(otherProject.id);
      expect(
        result.json.data.recentProjects.map((item: { id: string }) => item.id),
      ).not.toContain(removed.id);
      expect(result.json.data.recentMessages.length).toBeLessThanOrEqual(5);
      expect(JSON.stringify(result.json.data)).not.toContain('passwordHash');
      expect(
        result.json.data.recentMessages.every(
          (item: Record<string, unknown>) => !('message' in item),
        ),
      ).toBe(true);
    } finally {
      if (removedId) await prisma.project.delete({ where: { id: removedId } });
      await prisma.project.deleteMany({ where: { authorId: other.id } });
      await prisma.media.deleteMany({ where: { uploadedBy: other.id } });
      await prisma.user.delete({ where: { id: other.id } });
    }
  });
});
