import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';

import { RequestUser } from '../utils/types';

import { JwtGuard } from '../auth/jwt.guard';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  get(@Req() req: RequestUser) {
    return this.usersService.getById(req.user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: RequestUser) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: RequestUser) {
    return this.usersService.getWishesById(req.user.id);
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Post('find')
  find(@Body() findUserDto: FindUserDto) {
    return this.usersService.findByUsernameOrEmail(findUserDto.query);
  }
}
