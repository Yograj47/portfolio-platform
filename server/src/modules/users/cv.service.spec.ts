import type { UsersService } from './users.service';
import type { ConfigService } from '@nestjs/config';
import { CvService } from './cv.service';
import {
  BadGatewayException,
  NotFoundException,
  ServiceUnavailableException,
  StreamableFile,
} from '@nestjs/common';
describe('CV downloads', () => {
  const users = { getPublicProfile: jest.fn() };
  const config = { get: jest.fn().mockReturnValue('assets.example.com') };
  const service = new CvService(
    users as unknown as UsersService,
    config as unknown as ConfigService,
  );
  beforeEach(() =>
    users.getPublicProfile.mockResolvedValue({
      resumeUrl: 'https://assets.example.com/cv.pdf',
    }),
  );
  afterEach(() => jest.restoreAllMocks());
  it('returns a PDF with attachment headers', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('%PDF-1.7 test'));
    const file = await service.file(true);
    expect(file).toBeInstanceOf(StreamableFile);
    expect(file.getHeaders().disposition).toContain('attachment');
  });
  it('rejects unconfigured hosts before fetching', async () => {
    const fetch = jest.spyOn(global, 'fetch');
    users.getPublicProfile.mockResolvedValue({
      resumeUrl: 'https://other.example.com/cv.pdf',
    });
    await expect(service.file()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects non-PDF responses', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('<html>error</html>'));
    await expect(service.file()).rejects.toBeInstanceOf(BadGatewayException);
  });
  it('handles missing CV', async () => {
    users.getPublicProfile.mockResolvedValue({ resumeUrl: null });
    await expect(service.file()).rejects.toBeInstanceOf(NotFoundException);
  });
});
