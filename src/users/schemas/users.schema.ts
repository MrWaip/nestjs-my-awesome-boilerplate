import { object, string } from '@hapi/joi';
import { CreateUserDto } from '../dto/create-user.dto';

export const createUserSchema = object<CreateUserDto>({
  name: string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: string()
    .email()
    .required(),
  password: string()
    .min(3)
    .max(255)
    .required(),
});
