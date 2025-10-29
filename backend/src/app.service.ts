import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './test.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

  async getHello(): Promise<string> {
    try {
      // Test MongoDB connection by creating a test document
      const testDoc = new this.testModel({
        message: 'Hello World from MongoDB!',
      });

      const savedDoc = await testDoc.save();

      // Get count of documents
      const count = await this.testModel.countDocuments();

      return `Hello World from docker backend! MongoDB connected successfully. Document saved with ID: ${String(savedDoc._id)}. Total documents: ${count}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return `Hello World from docker backend! MongoDB connection failed: ${errorMessage}`;
    }
  }
}
