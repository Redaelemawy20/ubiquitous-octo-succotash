import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signupDto: SignupDto,
  ): Promise<{ access_token: string; user: Omit<UserDocument, 'password'> }> {
    const { name, email, password } = signupDto;

    const user = await this.usersService.create(name, email, password);

    const payload = { sub: user._id, email: user.email, name: user.name };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log({
      level: 'info',
      message: 'User successfully signed up',
      data: { userId: user._id, email: user.email },
    });

    // Return user without password
    const userObject = user.toObject() as UserDocument;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      access_token,
      user: userWithoutPassword as Omit<UserDocument, 'password'>,
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.log({
        level: 'error',
        message: 'Invalid credentials',
        data: { email },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.log({
        level: 'error',
        message: 'Invalid credentials',
        data: { email },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, name: user.name };

    this.logger.log({
      level: 'info',
      message: 'User successfully signed in',
      data: { userId: user._id, email: user.email },
    });

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
