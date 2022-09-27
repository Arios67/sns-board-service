import * as bcrypt from 'bcrypt';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('가입되지 않은 이메일입니다.', 400);
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return user;
  }

  async setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_KEY, expiresIn: '1d' },
    );

    // 로컬 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ user, res }) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_KEY, expiresIn: '1h' },
    );
    res.send(accessToken);
  }
}
