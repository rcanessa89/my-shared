import { type APIGatewayProxyEventV2, type Context } from 'aws-lambda';
import { getLogger } from '@rcanessa/node-logger';

export { getLogger } from '@rcanessa/node-logger';

export const apiGatewayLogger = (
  name: string,
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  const {
    version,
    headers,
    queryStringParameters,
    pathParameters,
    requestContext
  } = event;

  return getLogger({
    name,
    level: process.env['AWS_LAMBDA_LOG_LEVEL'] || 'info',
    formatters: {
      bindings: () => ({
        nodeVersion: process.version,
        requestId: context.awsRequestId,
        function: process.env['AWS_LAMBDA_FUNCTION_NAME']
      }),
      log: (obj: unknown) => ({
        event: {
          version,
          headers,
          queryStringParameters,
          pathParameters,
          requestContext
        },
        metadata: {
          ...(obj || {})
        }
      })
    },
    redact: ['event.headers.Authorization', 'event.headers.authorization']
  });
};
