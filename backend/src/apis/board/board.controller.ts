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
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthAccessGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { BoardService } from './board.service';
import { BoardDTO } from './dtos/board.dto';
import { BoardListDTO } from './dtos/boardList.dto';
import { CreateBoardInput } from './dtos/createBoard.input';
import { UpdateBoardInput } from './dtos/updateBoard.input';
import { OrderByEnum } from './enum/orderBy.enum';
import { OrderingValueEnum } from './enum/orderingValue.enum';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('AccessToken')
  @ApiOperation({ summary: 'Board Create', description: '게시글 생성' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiCreatedResponse({ type: BoardDTO })
  @Post()
  async create(
    @Body() input: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.create(input, { currentUser });
  }

  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('AccessToken')
  @ApiOperation({ summary: 'Add Like', description: '게시글 좋아요' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 게시글입니다.',
  })
  @Post('/like/:boardId')
  async like(
    @Param('boardId') boardId: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.like(boardId, currentUser.id);
  }

  @UseGuards(AuthAccessGuard)
  @ApiBearerAuth('AccessToken')
  @ApiOperation({ summary: 'Board Update', description: '게시글 수정' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 게시글입니다.',
  })
  @ApiOkResponse({ type: Number, description: 'updated Board Id' })
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
  @ApiBearerAuth('AccessToken')
  @ApiOperation({ summary: 'Board Delete', description: '게시글 삭제' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 게시글입니다.',
  })
  @ApiOkResponse({ type: Boolean, description: 'IsAffected' })
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
  @ApiBearerAuth('AccessToken')
  @ApiOperation({ summary: 'Board Restore', description: '삭제한 게시글 복구' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 게시글입니다.',
  })
  @ApiOkResponse({ type: Boolean, description: 'IsAffected' })
  @Post(':boardId')
  async restore(
    @Param('boardId') boardId: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.boardService.restore(boardId, currentUser.id);
  }

  @ApiOperation({ summary: 'Board Read', description: '게시글 상세보기' })
  @ApiNoContentResponse()
  @ApiOkResponse({ type: BoardDTO })
  @Get(':boardId')
  async fetchBoard(@Param('boardId') boardId: number) {
    return await this.boardService.findOne(boardId);
  }

  @ApiQuery({
    name: 'orderBy',
    type: String,
    required: false,
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
    description: '제목 검색',
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
    example: '#태그1,#태그2',
    description: '태그 필터링',
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    required: false,
    description: '페이지 당 받아볼 게시글 수',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'default = 1',
  })
  @ApiOperation({ summary: 'Board List', description: '게시글 목록 조회' })
  @ApiOkResponse({ type: BoardListDTO })
  @Get()
  async fetchBoards(
    @Query('orderBy') orderBy: OrderByEnum,
    @Query('orderingValue') orderingValue: OrderingValueEnum,
    @Query('search') search: string,
    @Query('filter') filter: string,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    orderBy ? orderBy : (orderBy = OrderByEnum.DESC);
    orderingValue
      ? orderingValue
      : (orderingValue = OrderingValueEnum.CREATEDAT);
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
