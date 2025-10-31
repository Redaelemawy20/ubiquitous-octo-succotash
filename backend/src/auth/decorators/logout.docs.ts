import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const LogoutDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user' }),
    ApiResponse({
      status: 200,
      description: 'Logout successful',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Logout successful' },
        },
      },
    }),
  );
};
