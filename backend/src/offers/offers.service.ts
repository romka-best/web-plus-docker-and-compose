import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });
    const { price, raised, owner } = wish;

    if (userId === owner.id) {
      throw new ForbiddenException('You cannot give money for your wishes');
    }

    if (raised === price) {
      throw new ForbiddenException('Money already collected');
    }

    if (amount + raised > price) {
      throw new ForbiddenException(
        'You cannot give more money than the wish need',
      );
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.dataSource.transaction(async (transaction) => {
      await transaction.insert<Offer>(Offer, offer);
      await transaction.update<Wish>(Wish, itemId, {
        raised: raised + amount,
      });
    });

    return this.offerRepository.save(offer);
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  getAll() {
    return this.findMany({
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }

  getById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }
}
