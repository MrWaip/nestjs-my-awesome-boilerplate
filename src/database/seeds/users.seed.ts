import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Connection } from 'typeorm';
import { Seeder } from 'typeorm-seeding';

export default class UsersSeed implements Seeder {
  public async run(_, connection: Connection): Promise<void> {
    const data: User[] = [
      new User({
        email: 'support@svyazcom.ru',
        fname: 'Константин',
        lname: 'Лобков',
        mname: 'Вячеславович',
        locale: 'ru',
        password: await UsersService.hashPassword('password'),
        timezone: 'UTC',
      }),
      new User({
        email: 'test@svyazcom.ru',
        fname: 'Test',
        lname: 'Tested',
        locale: 'en',
        password: await UsersService.hashPassword('password'),
        timezone: 'UTC',
      }),
    ];

    await connection.getRepository(User).save(data);
  }
}
