import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      this.logger.log({
        level: 'error',
        message: 'User creation failed: email already exists',
        data: { email },
      });
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const createdUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    let savedUser: UserDocument;
    try {
      savedUser = await createdUser.save();
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to save user to database',
        data: {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw new InternalServerErrorException('Failed to create user');
    }

    this.logger.log({
      level: 'info',
      message: 'User created successfully',
      data: { userId: savedUser._id, email: savedUser.email },
    });

    return savedUser;
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Password validation error',
        data: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
      return false;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: refreshToken },
      })
      .exec();
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      })
      .exec();
  }

  async clearAllRefreshTokens(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      })
      .exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ refreshTokens: refreshToken }).exec();
  }
}
