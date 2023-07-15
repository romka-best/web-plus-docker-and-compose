import { IsString, Length, NotEquals } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @NotEquals('')
  password: string;
}
