import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<{
    user: Omit<UserDocument, 'password'>;
  }> {
    const { name, email, password } = signupDto;

    const user = await this.usersService.create(name, email, password);

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
    try {
      const access_token = await this.jwtService.signAsync(payload);

      // Generate refresh token with longer expiration
      const refreshTokenExpiresIn = this.configService.get<number>(
        'JWT_REFRESH_EXPIRES_IN',
        7 * 24 * 60 * 60, // 7 days in seconds
      );
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
      });

      // Store refresh token in database
      await this.usersService.addRefreshToken(String(user._id), refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to sign token',
        data: { error: (error as Error).message },
      });
      throw new InternalServerErrorException('Failed to sign token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        name?: string;
      }>(refreshToken);

      // Check if refresh token exists in database
      const user = await this.usersService.findByRefreshToken(refreshToken);
      if (!user) {
        this.logger.log({
          level: 'error',
          message: 'Refresh token not found in database',
          data: { userId: payload.sub },
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const newPayload = {
        sub: user._id,
        email: user.email,
        name: user.name,
      };
      const access_token = await this.jwtService.signAsync(newPayload);

      this.logger.log({
        level: 'info',
        message: 'Access token refreshed successfully',
        data: { userId: user._id, email: user.email },
      });

      return { access_token };
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to refresh token',
        data: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.usersService.removeRefreshToken(userId, refreshToken);
  }
}
