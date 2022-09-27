import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class LikeBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board)
  board: Board;

  @Column()
  userId: String;
}
