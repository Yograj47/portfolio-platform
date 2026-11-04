import type { UsersService } from '../users/users.service';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';

describe('Refresh token storage', () => {
  it('hashes the complete token before bcrypt and generates distinct refresh IDs', async () => {
    const compare = jest
      .spyOn(bcrypt, 'compare')
      .mockReturnValue(Promise.resolve(true) as never);
    const hash = jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValue(Promise.resolve('stored') as never);
    const users = {
      findByEmail: jest
        .fn()
        .mockResolvedValue({ id: 'u', passwordHash: 'password' }),
      beginSession: jest.fn().mockResolvedValue({ authVersion: 1 }),
      updateRefreshToken: jest.fn().mockResolvedValue(true),
    };
    const jwt = { signAsync: jest.fn().mockResolvedValue('a'.repeat(150)) };
    const config = { getOrThrow: jest.fn().mockReturnValue('value') };
    try {
      const service = new AuthService(
        users as unknown as UsersService,
        jwt as unknown as JwtService,
        config as unknown as ConfigService,
      );
      await service.login({ email: 'a@example.com', password: 'password' });
      await service.login({ email: 'a@example.com', password: 'password' });
      expect(hash).toHaveBeenCalledWith(
        createHash('sha256').update('a'.repeat(150)).digest('hex'),
        10,
      );
      const first = jwt.signAsync.mock.calls[1] as unknown as [{ jti: string }];
      const second = jwt.signAsync.mock.calls[3] as unknown as [
        { jti: string },
      ];
      expect(first[0].jti).toBeTruthy();
      expect(first[0].jti).not.toBe(second[0].jti);
    } finally {
      compare.mockRestore();
      hash.mockRestore();
    }
  });
});
