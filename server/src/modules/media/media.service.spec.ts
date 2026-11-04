import { MediaService } from './media.service';
import type { PrismaService } from '@/database/prisma/prisma.service';
import type { ImageKitService } from './imagekit.service';

describe('Media lifecycle', () => {
  function setup(projects = 0, profiles = 0) {
    const file = {
      id: 'm',
      publicId: 'provider-id',
      uploadedBy: 'u',
      url: 'https://cdn.test/image.png',
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'm' }]),
      media: {
        findFirst: jest.fn().mockResolvedValue(file),
        delete: jest.fn().mockResolvedValue(file),
      },
      projectMedia: { count: jest.fn().mockResolvedValue(projects) },
      user: { count: jest.fn().mockResolvedValue(profiles) },
    };
    const prisma = {
      $transaction: jest.fn((work: (tx: unknown) => unknown) => work(tx)),
      media: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(({ data }: { data: unknown }) => data),
      },
    };
    const provider = {
      deleteFile: jest.fn().mockResolvedValue(undefined),
      getFile: jest.fn().mockResolvedValue({
        mime: 'image/png',
        size: 42,
        url: file.url,
        name: 'verified.png',
        width: 20,
        height: 10,
      }),
    };
    const service = new MediaService(
      prisma as unknown as PrismaService,
      provider as unknown as ImageKitService,
    );
    return { service, tx, provider, prisma };
  }
  it.each([
    [1, 0],
    [0, 1],
  ])(
    'rejects deletion while referenced by projects=%s profiles=%s',
    async (projects, profiles) => {
      const { service, provider, tx } = setup(projects, profiles);
      await expect(service.remove('m', 'u')).rejects.toThrow('in use');
      expect(provider.deleteFile).not.toHaveBeenCalled();
      expect(tx.media.delete).not.toHaveBeenCalled();
    },
  );
  it('keeps the database record when storage deletion fails', async () => {
    const { service, provider, tx } = setup();
    provider.deleteFile.mockRejectedValue(new Error('unavailable'));
    await expect(service.remove('m', 'u')).rejects.toThrow('record was kept');
    expect(tx.media.delete).not.toHaveBeenCalled();
  });
  it('removes unused files and handles provider files already missing', async () => {
    const { service, provider, tx } = setup();
    provider.deleteFile.mockRejectedValue({ status: 404 });
    await service.remove('m', 'u');
    expect(tx.media.delete).toHaveBeenCalledWith({ where: { id: 'm' } });
  });
  it('cannot delete another owner file', async () => {
    const { service, tx, provider } = setup();
    tx.media.findFirst.mockResolvedValue(null);
    await expect(service.remove('m', 'other')).rejects.toThrow('not found');
    expect(provider.deleteFile).not.toHaveBeenCalled();
  });
  it('records verified provider metadata instead of client claims', async () => {
    const { service } = setup();
    const result = await service.create('u', {
      publicId: 'provider-id',
      url: 'https://forged.test/file',
      fileName: 'fake.png',
      mimeType: 'image/png',
      type: 'IMAGE',
      size: 999,
    });
    expect(result).toMatchObject({
      url: 'https://cdn.test/image.png',
      fileName: 'verified.png',
      size: 42,
      uploadedBy: 'u',
    });
  });
  it('refuses a PDF disguised as a project image', async () => {
    const { service, provider } = setup();
    provider.getFile.mockResolvedValue({
      mime: 'application/pdf',
      size: 42,
      url: 'https://cdn.test/file.pdf',
      name: 'file.pdf',
      width: 0,
      height: 0,
    });
    await expect(
      service.create('u', {
        publicId: 'id',
        url: 'https://cdn.test/x',
        fileName: 'x',
        mimeType: 'image/png',
        type: 'IMAGE',
        size: 42,
      }),
    ).rejects.toThrow('public image or PDF');
  });
});
