import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBoardInput {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
  })
  readonly board_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  readonly content: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: Array,
  })
  readonly tagInput: string[];
}
