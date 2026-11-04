import { ConfigService } from '@nestjs/config';
import type { UsersService } from '../../users/users.service';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AccessTokenStrategy } from './access-token.strategy';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
describe('Access token session version', () => {
  const users = { findById: jest.fn().mockResolvedValue({ authVersion: 2 }) };
  const config = { getOrThrow: () => 'test-secret' };
  const strategy = new AccessTokenStrategy(
    config as unknown as ConfigService,
    users as unknown as UsersService,
  );
  it('accepts only the currently active session version', async () => {
    await expect(
      strategy.validate({ sub: 'owner', version: 2 }),
    ).resolves.toEqual({ sub: 'owner', version: 2 });
    await expect(
      strategy.validate({ sub: 'owner', version: 1 }),
    ).rejects.toThrow();
    await expect(
      strategy.validate({ sub: 'owner' } as JwtPayload),
    ).rejects.toThrow();
  });
  it('rejects a deleted account', async () => {
    users.findById.mockRejectedValueOnce(new NotFoundException());
    await expect(
      strategy.validate({ sub: 'owner', version: 2 }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('does not classify database outages as expired credentials', async () => {
    const failure = new Error('database unavailable');
    users.findById.mockRejectedValueOnce(failure);
    await expect(strategy.validate({ sub: 'owner', version: 2 })).rejects.toBe(
      failure,
    );
  });
});
