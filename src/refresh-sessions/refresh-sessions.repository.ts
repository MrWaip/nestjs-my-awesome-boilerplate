import { EntityRepository, Repository } from 'typeorm';
import { RefreshSession } from './enities/refresh-session.entity';

@EntityRepository(RefreshSession)
export class RefreshSessionsRepository extends Repository<RefreshSession> {
  async deleteExpiredByUserId(userId: string): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .andWhere('user_id = :userId', { userId })
      .andWhere('to_timestamp(expires_in / 1000) < now()')
      .execute();
  }

  async deleteByUserIdExceptLast(userId: string) {
    await this.createQueryBuilder()
      .delete()
      .andWhere('user_id = :userId', { userId })
      .andWhere(
        'id != (select rs.id from refresh_sessions rs where rs.user_id = :userId order by created_at desc limit 1)',
        { userId },
      )
      .execute();
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.count({ where: { user_id: userId } });
  }
}
