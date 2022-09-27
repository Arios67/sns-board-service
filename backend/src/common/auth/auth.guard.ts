import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthAccessGuard extends AuthGuard('access') {}

@Injectable()
export class AuthRefreshGuard extends AuthGuard('refresh') {}
