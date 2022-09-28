import { Board } from '../entities/board.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class BoardListDTO extends OmitType(Board, ['tags', 'content', 'id']) {
  @ApiProperty({
    description: '작성자 이메일',
    required: true,
  })
  authorEmail: string;

  @ApiProperty({
    description: '작성자 이메일',
    required: true,
  })
  tags: string[];

  constructor(board: Board) {
    super();
    this.title = board.title;
    this.tags = board.tags.map((e) => e.tag_name);
    this.watched = board.watched;
    this.liked = board.liked;
    (this.createdAt = board.createdAt), (this.authorEmail = board.user.email);
  }
}
