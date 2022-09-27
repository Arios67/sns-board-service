import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBoardInput } from './dtos/createBoard.input';
import { Tags } from './entities/tags.entity';
import { UpdateBoardInput } from './dtos/updateBoard.input';
import { BoardDTO } from './dtos/board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateBoardInput, { currentUser }) {
    const { tagInput, ...rest } = input;
    const tags = [];

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
      user: currentUser.id,
      tags: tags,
    });

    return new BoardDTO(result);
  }

  async update(input: UpdateBoardInput, { currentUser }) {
    const board = await this.boardRepository.findOneBy({
      id: input.board_id,
    });
    if (!board) {
      throw new HttpException('', 204);
    }

    if (currentUser.id !== board.user.id) {
      throw new HttpException('작성자가 아닙니다.', 401);
    }

    const result = await this.boardRepository.save({
      ...board,
      ...input,
    });

    return new BoardDTO(result);
  }
}
