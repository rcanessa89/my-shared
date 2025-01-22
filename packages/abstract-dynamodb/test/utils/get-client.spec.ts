import { DynamoDB } from '@aws-sdk/client-dynamodb';

import { getClient } from '../../src/utils/get-client';

describe('utils/get-client - getClient', () => {
  it('Should return a DynamoDB instance', () => {
    const client = getClient();

    expect(client).toBeInstanceOf(DynamoDB);
  });

  it('Should be the same instance', () => {
    const client1 = getClient();
    const client2 = getClient();

    expect(client1).toBe(client2);
  });
});
