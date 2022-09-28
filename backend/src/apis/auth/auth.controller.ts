import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthRefreshGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput } from '../user/dtos/createUser.input';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'logIn' })
  @ApiBadRequestResponse({ description: '가입되지 않은 이메일입니다.' })
  @ApiUnauthorizedResponse({ description: '비밀번호가 틀렸습니다.' })
  @ApiOkResponse({ description: 'AccessToken and RefeshToken in JWT' })
  @Post('login')
  async login(@Body() input: CreateUserInput, @Res() res: Response) {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    console.log(user);
    this.authService.setRefreshToken({ user, res });
    this.authService.getAccessToken({ user, res });
    return;
  }

  @ApiOperation({ summary: 'restoreAccessToken' })
  @ApiOkResponse({ description: 'AccessToken in JWT' })
  @UseGuards(AuthRefreshGuard)
  @Post('restore')
  async restoreAccessToken(
    @CurrentUser() user: ICurrentUser,
    @Res() res: Response,
  ) {
    return this.authService.getAccessToken({ user, res });
  }
}
