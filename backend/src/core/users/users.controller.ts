import { Controller, Patch, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('onboarding-complete')
  async completeOnboarding(@Req() req: any) {
    return this.usersService.updateOnboardingStatus(req.user.userId, true);
  }
}
