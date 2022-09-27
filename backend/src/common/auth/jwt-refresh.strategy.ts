import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookies;
        console.log(cookies);
        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: process.env.REFRESH_KEY,
    });
  }

  validate({ payload }) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
