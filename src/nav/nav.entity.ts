import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'navs' })
export class Nav {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  workplace?: string;

  @Column()
  icon?: string;

  @Column()
  visible: boolean;

  @Column()
  parent_id?: number;

  @Column()
  title_i18n?: number;

  public constructor(init?: Partial<Nav>) {
    Object.assign(this, init);
  }
}
