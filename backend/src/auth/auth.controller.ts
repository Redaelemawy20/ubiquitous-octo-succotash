import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log({
      level: 'info',
      message: 'signUp request received',
      data: signupDto,
    });
    const result = await this.authService.signUp(signupDto);

    // Set HTTP-only cookie
    response.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return user data without token
    return { user: result.user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log({
      level: 'info',
      message: 'signIn request received',
      data: signinDto,
    });
    const result = await this.authService.signIn(
      signinDto.email,
      signinDto.password,
    );

    // Set HTTP-only cookie
    response.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Return success without token
    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.logger.log({
      level: 'info',
      message: 'User logout request',
    });
    // Clear the cookie
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logout successful' };
  }

  @Post('me')
  async getProfile(@Req() request: Request) {
    const token = request.cookies?.token as string | undefined;
    if (!token) {
      this.logger.log({
        level: 'error',
        message: 'Get profile failed: no token provided',
      });
      throw new UnauthorizedException('Authentication required');
    }

    try {
      // Decode and verify the JWT token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Extract user info from token payload
      const user = {
        _id: payload.sub,
        email: payload.email,
        name: payload.name || 'User', // Fallback if name not in token
      };

      return { user };
    } catch (error) {
      // Token is invalid or expired
      this.logger.log({
        level: 'error',
        message: 'Invalid or expired token',
        data: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
