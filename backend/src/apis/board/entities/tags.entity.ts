import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag_name: string;

  @ManyToMany(() => Board, (boards) => boards.tags)
  boards: Board[];
}
