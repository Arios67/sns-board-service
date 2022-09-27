import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Board } from '../entities/board.entity';

export class CreateBoardInput extends PickType(Board, ['title', 'content']) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly content: string;

  @IsArray()
  @ApiProperty({
    type: Array,
  })
  readonly tagInput: string[];
}
