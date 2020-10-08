import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Token } from './enities/token.entity';
import { Repository } from 'typeorm';
import { SaveRefeshTokenDto } from './dto';
import { DateTime } from 'luxon';
import { TOKENS_REPOSITORY } from './constants';

@Injectable()
export class TokensService {
  private tokenRepository: Repository<Token>;
  private userService: UsersService;

  constructor(@Inject(TOKENS_REPOSITORY) tokenRepository: Repository<Token>, userService: UsersService) {
    this.tokenRepository = tokenRepository;
    this.userService = userService;
  }

  async saveRefreshToken(data: SaveRefeshTokenDto): Promise<Token> {
    const user = await this.userService.findByIdOrFail(data.user_id);

    const refresh_token = new Token();
    refresh_token.user = user;
    refresh_token.value = data.value;
    refresh_token.ip = data.ip;
    refresh_token.expiry_date = this.getDateByExpiry(data.expiry);

    return await this.tokenRepository.save(refresh_token);
  }

  async findByValue(value: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({ where: { value } });
  }

  async delete(token: Token): Promise<void> {
    await this.tokenRepository.delete(token.id);
  }

  /**
   * Возвращает дату, когда истечет токен, на основе expiry
   * @param expiry срок жизни токена в секундах
   */
  getDateByExpiry(expiry: number) {
    return DateTime.local()
      .plus({ seconds: expiry })
      .toJSDate();
  }
}
