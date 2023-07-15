import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';

import { OffersModule } from './offers/offers.module';

import { UsersModule } from './users/users.module';

import { WishesModule } from './wishes/wishes.module';

import { WishlistsModule } from './wishlists/wishlists.module';

import { AuthModule } from './auth/auth.module';

import { HashModule } from './hash/hash.module';

import config from './utils/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
