import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { SkillService } from '../skill/skill.service';
import { TimelineService } from '../timeline/timeline.service';
@Injectable()
export class PortfolioService {
  constructor(
    private readonly users: UsersService,
    private readonly projects: ProjectService,
    private readonly skills: SkillService,
    private readonly timelines: TimelineService,
  ) {}
  async findPublic() {
    const [profile, projects, skills, timelines] = await Promise.all([
      this.users.getPublicProfile(),
      this.projects.findAll(),
      this.skills.findAll(),
      this.timelines.findAll(),
    ]);
    return { profile, projects, skills, timelines };
  }
}
