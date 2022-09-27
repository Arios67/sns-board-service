import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Delete,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthAccessGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dtos/createBoard.input';
import { UpdateBoardInput } from './dtos/updateBoard.input';
import { OrderByEnum } from './enum/orderBy.enum';
import { OrderingValueEnum } from './enum/orderingValue.enum';

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
  @Post('/like/:boardId')
  async like(
    @Param('boardId') boardId: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.like(boardId, currentUser.id);
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

  /**
   * @param boardId
   * @description 게시글 삭제
   * @returns is_affected
   */
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('Access Token')
  @Delete(':boardId')
  async delete(
    @Param('boardId') boardId: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.delete(boardId, currentUser.id);
  }

  /**
   * @param boardId
   * @description 삭제한 게시글 복구
   * @returns is_affected
   */
  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('Access Token')
  @Post(':boardId')
  async restore(
    @Param('boardId') boardId: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.restore(boardId, currentUser.id);
  }

  @Get(':boardId')
  async fetchBoard(@Param('boardId') boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @ApiQuery({
    name: 'orderBy',
    type: String,
    required: true,
    enum: OrderByEnum,
    example: 'DESC',
  })
  @ApiQuery({
    name: 'orderingValue',
    type: String,
    required: false,
    enum: OrderingValueEnum,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'default = 1',
  })
  @Get()
  async fetchBoards(
    @Query('orderBy') orderBy: OrderByEnum,
    @Query('orderingValue') orderingValue: OrderingValueEnum,
    @Query('search') search: string,
    @Query('filter') filter: string,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    orderingValue
      ? orderingValue
      : (orderingValue = OrderingValueEnum.createdAt);
    take ? take : (take = 10);
    page ? page : (page = 1);

    return await this.boardService.find(
      orderBy,
      orderingValue,
      search,
      filter,
      take,
      page,
    );
  }
}
