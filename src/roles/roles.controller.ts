import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async get() {
    return this.rolesService.get();
  }
}
