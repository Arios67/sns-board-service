import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { LikeBoard } from './entities/likeBoard.entity';
import { Tags } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Tags, User, LikeBoard])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
