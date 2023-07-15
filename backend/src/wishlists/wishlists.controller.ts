import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { RequestUser } from '../utils/types';

import { JwtGuard } from '../auth/jwt.guard';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: RequestUser,
  ) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.wishlistsService.getById(+id);
  }

  @Get()
  getAll() {
    return this.wishlistsService.getAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestUser,
  ) {
    return this.wishlistsService.update(+id, req.user.id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestUser) {
    return this.wishlistsService.delete(+id, req.user.id);
  }
}
