import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  value: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp with time zone')
  expiry_date: Date;

  @ManyToOne(
    () => User,
    user => user.refresh_tokens,
    { eager: true },
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column('text')
  ip: string;
}
