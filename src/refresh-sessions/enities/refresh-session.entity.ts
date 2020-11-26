import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity({ name: 'refresh_sessions' })
export class RefreshSession {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid')
  refresh_token: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expires_in: number;

  @ManyToOne(
    () => User,
    user => user.refresh_sessions,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column('text')
  ip: string;

  @Column('text')
  user_agent?: string;
  
  @Column('text')
  fingerprint?: string;
}
