import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/apis/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Tags } from './tags.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  title: string;

  @Column()
  @ApiProperty({ type: String })
  content: string;

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  watched: number;

  @Column({ default: 0 })
  @ApiProperty({ type: Number })
  liked: number;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @JoinTable()
  @ManyToMany(() => Tags, (tags) => tags.boards, { nullable: true })
  tags: Tags[];
}
