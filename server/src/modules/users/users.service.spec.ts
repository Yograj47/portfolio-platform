import type { PrismaService } from '@/database/prisma/prisma.service';
import { UsersService } from './users.service';

describe('Profile responses', () => {
  it('does not serialize credential hashes', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'u',
          name: 'Yograj',
        }),
      },
    };
    const profile = await new UsersService(
      prisma as unknown as PrismaService,
    ).getSafeProfile('u');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'u' },
      omit: { passwordHash: true, refreshTokenHash: true },
    });
    expect(profile).toEqual({ id: 'u', name: 'Yograj' });
  });
});
