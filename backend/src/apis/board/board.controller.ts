import { Controller, Post, UseGuards, Body, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthAccessGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dtos/createBoard.input';
import { UpdateBoardInput } from './dtos/updateBoard.input';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('Access Token')
  @Post()
  async create(
    @Body() input: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.create(input, { currentUser });
  }

  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('Access Token')
  @Put()
  async update(
    @Body() input: UpdateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.update(input, { currentUser });
  }
}
