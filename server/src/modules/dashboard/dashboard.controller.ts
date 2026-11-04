import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { DashboardService } from './dashboard.service';
@Controller('dashboard')
@UseGuards(AccessTokenGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}
  @Get('summary')
  summary(@CurrentUser() user: JwtPayload) {
    return this.dashboard.summary(user.sub);
  }
}
