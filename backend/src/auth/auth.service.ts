import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashService } from '../hash/hash.service';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    return {
      access_token: this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' }),
    };
  }

  async validatePassword(username: string, checkPassword: string) {
    const user = await this.userService.findOne({
      where: { username },
      select: { password: true },
    });
    if (!user || !user.password) return null;

    const { password, ...result } = user;

    return (await this.hashService.verify(checkPassword, password))
      ? result
      : null;
  }
}
