import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  editedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column({
    nullable: true,
  })
  @MaxLength(1500)
  @IsString()
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @IsArray()
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Array<Wish>;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
