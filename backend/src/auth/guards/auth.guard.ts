import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
}

// Extend Express Request to include user
declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      email: string;
      name?: string;
    };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.token as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      // Verify and decode the JWT token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Attach user info to request object
      request.user = {
        _id: payload.sub,
        email: payload.email,
        name: payload.name,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
