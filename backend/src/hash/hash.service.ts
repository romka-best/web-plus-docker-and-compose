import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async generate(password: string) {
    return await bcrypt.hash(password, this.configService.get('saltRound'));
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
