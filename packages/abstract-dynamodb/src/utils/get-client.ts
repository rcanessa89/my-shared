import { DynamoDB } from '@aws-sdk/client-dynamodb';

let dynamodbClient: DynamoDB | null = null;

export const getClient = (
  ...params: ConstructorParameters<typeof DynamoDB>
) => {
  if (dynamodbClient) {
    return dynamodbClient;
  }

  dynamodbClient = new DynamoDB(...params);

  return dynamodbClient;
};
