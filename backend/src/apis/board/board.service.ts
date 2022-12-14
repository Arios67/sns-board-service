import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBoardInput } from './dtos/createBoard.input';
import { Tags } from './entities/tags.entity';
import { UpdateBoardInput } from './dtos/updateBoard.input';
import { BoardDTO } from './dtos/board.dto';
import { LikeBoard } from './entities/likeBoard.entity';
import { OrderByEnum } from './enum/orderBy.enum';
import { OrderingValueEnum } from './enum/orderingValue.enum';
import { BoardListDTO } from './dtos/boardList.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    @InjectRepository(LikeBoard)
    private readonly likeBoardRepository: Repository<LikeBoard>,

    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateBoardInput, { currentUser }) {
    const { tagInput, ...rest } = input;
    const tags = [];

    if (!tagInput) {
      const result = await this.boardRepository.save({
        ...rest,
        user: currentUser,
        tags: tags,
      });
      return new BoardDTO(result);
    }

    for (let i = 0; i < tagInput.length; i++) {
      const tagName = tagInput[i];
      const savedTag = await this.tagsRepository.findOneBy({
        tag_name: tagName,
      });

      if (savedTag) {
        tags.push(savedTag);
      } else {
        const newTag = await this.tagsRepository.save({
          tag_name: tagName,
        });
        tags.push(newTag);
      }
    }

    const result = await this.boardRepository.save({
      ...rest,
      user: currentUser,
      tags: tags,
    });

    return new BoardDTO(result);
  }

  async like(boardId: number, currentUserId: string) {
    const board = await this.boardRepository.findOneBy({
      id: boardId,
    });
    if (!board) {
      throw new HttpException('???????????? ?????? ??????????????????.', 404);
    }

    const QB = this.dataSource.createQueryBuilder(LikeBoard, 'like_board');
    const prev = await QB.leftJoinAndSelect('like_board.board', 'board')
      .where('like_board.board =:board', { board: boardId })
      .andWhere('like_board.userId =:user', { user: currentUserId })
      .getOne();

    // ????????? ??? ???????????? ????????? ?????? ???????????? ????????? ????????? ????????? ??????
    // ?????? ?????? ?????? ?????? ????????? ??????
    if (!prev) {
      await this.likeBoardRepository.save({
        board: board,
        userId: currentUserId,
      });
      const liked = board.liked + 1;
      await this.boardRepository.update({ id: board.id }, { liked: liked });

      return true;
    } else {
      const liked = board.liked - 1;
      await this.likeBoardRepository.delete({ id: prev.id });
      await this.boardRepository.update({ id: board.id }, { liked: liked });

      return false;
    }
  }

  async update(input: UpdateBoardInput, { currentUser }) {
    const board = await this.boardRepository.findOneBy({
      id: input.board_id,
    });
    if (!board) {
      throw new HttpException('???????????? ?????? ??????????????????.', 404);
    }

    if (currentUser.id !== board.user.id) {
      throw new HttpException('???????????? ????????????.', 401);
    }

    const result = await this.boardRepository.save({
      ...board,
      ...input,
    });

    return result.id;
  }

  async delete(boardId: number, currentUserId: string) {
    const board = await this.boardRepository.findOneBy({
      id: boardId,
    });

    if (!board) {
      throw new HttpException('???????????? ?????? ??????????????????.', 404);
    }
    if (currentUserId !== board.user.id) {
      throw new HttpException('???????????? ????????????.', 401);
    }

    const result = await this.boardRepository.softDelete({ id: boardId });
    return result.affected;
  }

  async restore(boardId: number, currentUserId: string) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      withDeleted: true,
    });
    if (!board) {
      throw new HttpException('???????????? ?????? ??????????????????.', 404);
    }
    if (currentUserId !== board.user.id) {
      throw new HttpException('???????????? ????????????.', 401);
    }

    const result = await this.boardRepository.restore({ id: boardId });
    return result.affected;
  }

  async findOne(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: { tags: true },
    });
    if (!board) {
      throw new HttpException('', 204);
    }
    const addedWatched = board.watched + 1;
    const result = await this.boardRepository.save({
      ...board,
      watched: addedWatched,
    });

    return new BoardDTO(result);
  }

  async find(
    orderBy: OrderByEnum,
    orderingValue: OrderingValueEnum,
    search: string,
    filter: string,
    take: number,
    page: number,
  ) {
    const QB = this.dataSource
      .createQueryBuilder(Board, 'board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.tags', 'tags');

    //????????? ?????? ??????
    if (search) {
      QB.where('board.title Like :title', { title: search });
    }
    //????????? ?????? ??????
    if (filter) {
      const keywords = filter.split(',');
      for (let i = 0; i < keywords.length; i++) {
        QB.andWhere('tags.tag_name =:tag_name', { tag_name: keywords[i] });
      }
    }

    //????????? ?????? + ??????????????????
    const result = await QB.orderBy(`board.${orderingValue}`, orderBy)
      .skip(take * (page - 1))
      .take(take)
      .getMany();

    return result.map((e) => {
      return new BoardListDTO(e);
    });
  }
}
