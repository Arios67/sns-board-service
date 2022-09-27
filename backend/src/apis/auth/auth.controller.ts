import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthRefreshGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput } from '../user/dtos/createUser.input';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(AuthRefreshGuard)
  @Post('restore')
  async restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser,
    @Res() res: Response,
  ) {
    const user = currentUser;
    return this.authService.getAccessToken({ user, res });
  }
}
