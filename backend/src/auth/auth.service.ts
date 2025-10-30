import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  signIn(username: string, pass: string) {
    const user = this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
  }
}
