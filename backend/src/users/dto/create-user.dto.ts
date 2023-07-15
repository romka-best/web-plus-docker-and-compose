import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  NotEquals,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @NotEquals('')
  password: string;
}
