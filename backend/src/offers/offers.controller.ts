import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { RequestUser } from '../utils/types';

import { JwtGuard } from '../auth/jwt.guard';

import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestUser) {
    return this.offersService.create(req.user.id, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.getById(+id);
  }
}
