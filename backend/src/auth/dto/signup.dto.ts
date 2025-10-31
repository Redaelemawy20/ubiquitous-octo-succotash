import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string;

  @ApiProperty({
    description:
      'User password must contain at least one letter, one number, and one special character',
    example: 'SecurePass123!',
    minLength: 8,
    pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
