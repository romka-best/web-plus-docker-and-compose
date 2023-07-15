import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @MaxLength(1500)
  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: Array<number>;
}
