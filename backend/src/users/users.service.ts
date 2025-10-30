import { Injectable, NotFoundException } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  findOne(username: string): User {
    const user = this.users.find((user) => user.username === username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
