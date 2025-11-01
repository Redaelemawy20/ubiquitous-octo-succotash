import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RefreshDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token' }),
    ApiResponse({
      status: 200,
      description: 'Access token refreshed successfully',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid refresh token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - refresh token not found',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );
};
