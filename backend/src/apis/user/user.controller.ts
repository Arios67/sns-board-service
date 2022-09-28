import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateUserInput } from './dtos/createUser.input';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'User Create', description: '회원가입' })
  @ApiUnprocessableEntityResponse({ description: '이미 가입된 이메일입니다.' })
  @ApiCreatedResponse({ type: String })
  async create(@Body() input: CreateUserInput) {
    return await this.userService.create(input);
  }
}
