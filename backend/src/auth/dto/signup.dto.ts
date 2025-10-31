import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
