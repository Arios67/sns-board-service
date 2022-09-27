import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserInput extends OmitType(User, ['id']) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly password: string;
}
