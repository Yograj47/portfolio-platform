import { Controller, Get, Header } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}
  @Get() @Header('Cache-Control', 'no-store') findPublic() {
    return this.service.findPublic();
  }
}
