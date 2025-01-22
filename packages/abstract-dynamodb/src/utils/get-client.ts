import { DynamoDB, type DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

let dynamodbClient: DynamoDB | null = null;

export const getClient = (config: DynamoDBClientConfig) => {
  if (dynamodbClient) {
    return dynamodbClient;
  }

  dynamodbClient = new DynamoDB(config);

  return dynamodbClient;
};
