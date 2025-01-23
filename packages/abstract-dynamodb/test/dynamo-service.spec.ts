import { DynamoDB } from '@aws-sdk/client-dynamodb';

import { DynamoService } from '../src/dynamo-service';
import { DynamoErrorNotFound } from '../src/utils/dynamo-error';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDB: jest.fn().mockReturnValue({
    query: jest.fn(),
    getItem: jest.fn(),
    putItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn()
  })
}));

class TestEntity {
  public id: string;
  public name: string;

  constructor({ id, name }: TestEntity) {
    this.id = id;
    this.name = name;
  }
}

class TestDynamoService extends DynamoService<TestEntity, { id: string }> {
  constructor() {
    super({
      tableName: 'table-test',
      type: 'TestEntity'
    });
  }

  protected pk(): string {
    return this.type;
  }

  protected sk(m: { id: string }): string {
    return m.id;
  }
}

const dynamoDummyUser = {
  PK: {
    S: 'TestEntity'
  },
  SK: {
    S: '1'
  },
  id: {
    S: '1'
  },
  name: {
    S: 'name'
  },
  createdAt: {
    S: '2024-01-23T03:37:08.698Z'
  },
  updatedAt: {
    S: '2024-11-23T03:37:08.698Z'
  }
};

describe('dynamo-service - DynamoService', () => {
  const service = new TestDynamoService();
  const mockClient = new DynamoDB();
  const mockDate = '2024-01-22T00:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockDate));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('list', () => {
    it('Should return a list of items', async () => {
      const lastEvaluatedKey = 'lastEvaluatedKey';

      jest.spyOn(mockClient, 'query').mockImplementationOnce(() => ({
        Items: [{ ...dynamoDummyUser }],
        Count: 1,
        LastEvaluatedKey: lastEvaluatedKey
      }));

      const limit = 5;
      const nextToken = 'nextToken';
      const result = await service.list({
        pk: 'USER#1',
        limit,
        nextToken
      });

      expect(mockClient.query).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith({
        TableName: 'table-test',
        ExpressionAttributeNames: { '#pk': 'PK' },
        ExpressionAttributeValues: { ':pk': { S: 'USER#1' } },
        KeyConditionExpression: '#pk = :pk',
        Limit: 5,
        ExclusiveStartKey: 'nextToken'
      });
      expect(result).toEqual({
        data: [
          {
            id: dynamoDummyUser.id.S,
            name: dynamoDummyUser.name.S,
            createdAt: dynamoDummyUser.createdAt.S,
            updatedAt: dynamoDummyUser.updatedAt.S
          }
        ],
        count: 1,
        nextToken: lastEvaluatedKey
      });
    });
  });

  describe('findOne', () => {
    it('Should find an item', async () => {
      jest.spyOn(mockClient, 'getItem').mockImplementationOnce(() => ({
        Item: { ...dynamoDummyUser }
      }));

      const result = await service.findOne({ id: dynamoDummyUser.id.S });

      expect(mockClient.getItem).toHaveBeenCalledTimes(1);
      expect(mockClient.getItem).toHaveBeenCalledWith({
        TableName: 'table-test',
        Key: {
          PK: {
            S: 'TestEntity'
          },
          SK: {
            S: dynamoDummyUser.id.S
          }
        }
      });
      expect(result).toEqual({
        id: dynamoDummyUser.id.S,
        name: dynamoDummyUser.name.S,
        createdAt: dynamoDummyUser.createdAt.S,
        updatedAt: dynamoDummyUser.updatedAt.S
      });
    });

    it('Should return not found', async () => {
      jest.spyOn(mockClient, 'getItem').mockImplementationOnce(() => ({
        Item: null
      }));

      try {
        await service.findOne({ id: dynamoDummyUser.id.S });

        expect(mockClient.getItem).toHaveBeenCalledTimes(1);

        fail();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(DynamoErrorNotFound);
      }
    });
  });

  describe('create', () => {
    it('Should create an item', async () => {
      jest.spyOn(mockClient, 'putItem');

      const id = '1';
      const name = 'name';
      const result = await service.create({
        id,
        name
      });

      expect(mockClient.putItem).toHaveBeenCalledTimes(1);
      expect(mockClient.putItem).toHaveBeenCalledWith({
        TableName: 'table-test',
        Item: {
          PK: {
            S: 'TestEntity'
          },
          SK: {
            S: '1'
          },
          type: {
            S: 'TestEntity'
          },
          id: {
            S: id
          },
          name: {
            S: name
          },
          createdAt: {
            S: mockDate
          },
          updatedAt: {
            S: mockDate
          }
        },
        ConditionExpression: 'attribute_not_exists(SK)'
      });
      expect(result).toEqual({
        id,
        name,
        createdAt: mockDate,
        updatedAt: mockDate
      });
    });
  });

  describe('update', () => {
    it('Should update an item', async () => {
      const id = '2';
      const newName = 'newname';
      const response = {
        id,
        name: newName,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      jest.spyOn(mockClient, 'updateItem');
      jest
        .spyOn(service, 'findOne')
        .mockReturnValueOnce(Promise.resolve({ ...response }));

      const result = await service.update({
        id,
        name: newName
      });

      expect(mockClient.updateItem).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(mockClient.updateItem).toHaveBeenCalledWith({
        TableName: 'table-test',
        Key: { PK: { S: 'TestEntity' }, SK: { S: '2' } },
        UpdateExpression:
          'set #id = :id, #name = :name, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#id': 'id',
          '#name': 'name',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':id': { S: id },
          ':name': { S: newName },
          ':updatedAt': { S: '2024-01-22T00:00:00.000Z' }
        }
      });
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('Should delete an item', async () => {
      jest.spyOn(mockClient, 'deleteItem');

      const id = '22';
      const findArgs = { id };
      const result = await service.delete(findArgs);

      expect(mockClient.deleteItem).toHaveBeenCalledTimes(1);
      expect(mockClient.deleteItem).toHaveBeenCalledWith({
        TableName: 'table-test',
        Key: { PK: { S: 'TestEntity' }, SK: { S: id } },
        ConditionExpression: 'attribute_exists(SK)'
      });
      expect(result).toEqual(findArgs);
    });
  });
});
