import { Controller, Get } from '@nestjs/common';

@Controller('navs')
export class NavController {
  @Get()
  get() {
    return [
      {
        icon: 'mdi-chart-line',
        id: 1,
        module_name: 'Users',
        order: 70,
        parent_id: null,
        permissions: [],
        prefix: 'users',
        title: 'Пользователи',
        visible: true,
      },
    ];
  }
}
