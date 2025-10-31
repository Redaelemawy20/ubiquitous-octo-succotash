import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SigninDto } from '../dto/signin.dto';

export const SigninDocs = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: SigninDto }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - validation error',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid credentials',
    }),
  );
};
