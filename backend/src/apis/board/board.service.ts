import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBoardInput } from './dtos/createBoard.input';
import { Tags } from './entities/tags.entity';

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

    return result.id;
  }
}
