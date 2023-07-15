import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  Length,
  IsUrl,
  IsDate,
  IsPositive,
  IsString,
  IsNumber,
} from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

import numericTransformer from '../../utils/numericTransformer';

@Entity()
export class Wish {
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

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  @IsNumber()
  @IsPositive()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Array<Offer>;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  @IsNumber()
  @IsPositive()
  copied: number;
}
