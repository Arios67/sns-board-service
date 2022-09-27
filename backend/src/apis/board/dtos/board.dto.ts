import { Board } from '../entities/board.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BoardDTO extends Board {
  @ApiProperty({
    description: '작성자 이메일',
    required: true,
  })
  authorEmail: string;

  constructor(board: Board) {
    super();
    this.id = board.id;
    this.title = board.title;
    this.content = board.content;
    this.tags = board.tags;
    this.watched = board.watched;
    (this.createdAt = board.createdAt), (this.authorEmail = board.user.email);
  }
}
