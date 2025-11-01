import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignupDocs } from './decorators/signup.docs';
import { SigninDocs } from './decorators/signin.docs';
import { LogoutDocs } from './decorators/logout.docs';
import { MeDocs } from './decorators/me.docs';
import { RefreshDocs } from './decorators/refresh.docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  @SignupDocs()
  async signUp(@Body() signupDto: SignupDto) {
    this.logger.log({
      level: 'info',
      message: 'signUp request received',
      data: signupDto,
    });
    const result = await this.authService.signUp(signupDto);

    // Return user data - user needs to login to get authenticated
    return {
      message: 'User created successfully. Please login to continue.',
      user: result.user,
    };
  }

  @Post('login')
  @SigninDocs()
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

    // Get JWT expiration time (in seconds) and convert to milliseconds for cookie
    const jwtExpiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);
    const accessTokenMaxAge = jwtExpiresIn * 1000; // Convert seconds to milliseconds

    // Get refresh token expiration time (in seconds) and convert to milliseconds
    const refreshTokenExpiresIn = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN',
      7 * 24 * 60 * 60, // 7 days in seconds
    );
    const refreshTokenMaxAge = refreshTokenExpiresIn * 1000; // Convert seconds to milliseconds

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict' as const,
    };

    // Set HTTP-only cookies for access and refresh tokens
    response.cookie('token', result.access_token, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    });

    response.cookie('refreshToken', result.refresh_token, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    });

    // Return success without token
    return { message: 'Login successful' };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @LogoutDocs()
  async logout(
    @CurrentUser() user: { _id: string; email: string; name?: string },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log({
      level: 'info',
      message: 'User logout request',
      data: { userId: user._id },
    });

    // Remove refresh token from database
    const refreshToken = request.cookies?.refreshToken as string | undefined;
    if (refreshToken) {
      try {
        await this.authService.removeRefreshToken(user._id, refreshToken);
      } catch (error) {
        this.logger.log({
          level: 'warn',
          message: 'Failed to remove refresh token from database',
          data: { userId: user._id, error: (error as Error).message },
        });
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    // Clear both cookies
    response.clearCookie('token', cookieOptions);
    response.clearCookie('refreshToken', cookieOptions);

    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @RefreshDocs()
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log({
      level: 'info',
      message: 'Refresh token request received',
    });

    // Get refresh token from cookie
    const refreshToken = request.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    // Get JWT expiration time (in seconds) and convert to milliseconds for cookie
    const jwtExpiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);
    const accessTokenMaxAge = jwtExpiresIn * 1000; // Convert seconds to milliseconds

    try {
      const result: { access_token: string } =
        await this.authService.refreshToken(refreshToken);

      // Set new access token cookie
      response.cookie('token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: accessTokenMaxAge,
      });

      return { message: 'Token refreshed successfully' };
    } catch (error: unknown) {
      // Clear invalid refresh token cookie
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      if (error instanceof Error) {
        throw error;
      }
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @MeDocs()
  getProfile(
    @CurrentUser() user: { _id: string; email: string; name?: string },
  ) {
    return { user };
  }
}
