import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  it('uses public CMS readers for every homepage section', async () => {
    const users = {
      getPublicProfile: jest.fn().mockResolvedValue({ name: 'Owner' }),
    };
    const projects = {
      findAll: jest.fn().mockResolvedValue([{ slug: 'published' }]),
    };
    const skills = { findAll: jest.fn().mockResolvedValue([]) };
    const timelines = { findAll: jest.fn().mockResolvedValue([]) };
    const service = new PortfolioService(
      users as never,
      projects as never,
      skills as never,
      timelines as never,
    );
    expect(await service.findPublic()).toEqual({
      profile: { name: 'Owner' },
      projects: [{ slug: 'published' }],
      skills: [],
      timelines: [],
    });
    expect(projects.findAll).toHaveBeenCalledWith();
  });
  it('rejects incomplete reads rather than returning a partial homepage', async () => {
    const service = new PortfolioService(
      { getPublicProfile: () => Promise.resolve({}) } as never,
      { findAll: () => Promise.reject(new Error('offline')) } as never,
      { findAll: () => Promise.resolve([]) } as never,
      { findAll: () => Promise.resolve([]) } as never,
    );
    await expect(service.findPublic()).rejects.toThrow('offline');
  });
});
