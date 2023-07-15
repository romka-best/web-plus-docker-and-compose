import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  create(ownerId: number, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });

    return this.wishlistsRepository.save(wishList);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  findMany(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.find(query);
  }

  getAll() {
    return this.findMany({
      relations: { owner: true, items: true },
    });
  }

  getById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.getById(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot edit not yours wishlist');
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...rest, items };

    await this.wishlistsRepository.save({ id, ...updatedWishlist });
    return this.getById(id);
  }

  async delete(id: number, userId: number) {
    const wishlist = await this.getById(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot edit not yours wishlist');
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
