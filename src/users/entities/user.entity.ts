import { RefreshSession } from '@/refresh-sessions/enities/refresh-session.entity';
import { Role } from '@/roles/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  fname: string;

  @Column('text')
  mname: string;

  @Column('text')
  lname: string;

  @Column('text')
  password: string;

  @Column('text')
  timezone: string;

  @Column('text')
  locale: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date;

  @OneToMany(
    () => RefreshSession,
    session => session.user,
  )
  refresh_sessions: RefreshSession[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  deleted_by?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by?: User;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
