import {
  DataSource,
  FindOneOptions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(ownerId: number, createWishDto: CreateWishDto) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  getAll() {
    return this.findMany({
      relations: { owner: true },
    });
  }

  getById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  getLastWishes() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  getTopWishes() {
    return this.findMany({ order: { copied: 'DESC' }, take: 10 });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const { owner, raised } = await this.getById(id);

    if (userId !== owner.id) {
      throw new ForbiddenException('You cannot edit not yours wishes');
    }

    if (updateWishDto.price && raised > 0) {
      throw new ForbiddenException(
        'You cannot change price when somebody already gave you some money',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(userId: number, id: number) {
    const wish = await this.getById(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('You cannot edit not yours wishes');
    }

    await this.wishesRepository.delete(id);
    return wish;
  }

  async copy(userId: number, wishId: number) {
    const wish = await this.findOne({ where: { id: wishId } });

    const { name, description, image, link, price, copied } = wish;

    const isExist = !!(await this.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: userId },
      },
      relations: { owner: true },
    }));

    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, wishId, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }
}
