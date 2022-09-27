import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/createUser.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(input: CreateUserInput) {
    const { password, email } = input;
    const hashedPassword = await bcrypt.hash(password, 1);
    const savedEmail = await this.userRepository.findOneBy({
      email,
    });
    if (savedEmail) {
      throw new HttpException('이미 가입된 이메일 입니다.', 422);
    }
    const result = await this.userRepository.save({
      email,
      password: hashedPassword,
    });
    return result.id;
  }
}
