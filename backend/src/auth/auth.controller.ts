import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Body() signIn: SignInDto) {
    const user = await this.usersService.getByUsername(signIn.username);
    return this.authService.auth({
      ...user,
      password: signIn.password,
    });
  }
}
