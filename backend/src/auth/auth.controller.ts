import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignupDocs } from './decorators/signup.docs';
import { SigninDocs } from './decorators/signin.docs';
import { LogoutDocs } from './decorators/logout.docs';
import { MeDocs } from './decorators/me.docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  @SignupDocs()
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
  @LogoutDocs()
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

  @Get('me')
  @UseGuards(AuthGuard)
  @MeDocs()
  getProfile(
    @CurrentUser() user: { _id: string; email: string; name?: string },
  ) {
    return { user };
  }
}
