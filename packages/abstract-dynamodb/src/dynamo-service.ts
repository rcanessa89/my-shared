import {
  DynamoDB,
  type DynamoDBClientConfig,
  type AttributeValue
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { DEFAULT_LIMIT } from './constants';
import {
  type IListArgs,
  type IDynamoService,
  type IListResult,
  type IModelDTO,
  type IItemHandler,
  type IItem
} from './types';
import { getClient } from './utils/get-client';
import { getQueryExpressions } from './utils/get-query-expressions';
import { getUpdateExpression } from './utils/get-update-expression';
import { DynamoErrorNotFound, DynamoErrorUnknown } from './utils/dynamo-error';

export abstract class DynamoService<T, FindOneArgs, Dto = T & IModelDTO>
  implements IDynamoService<T, FindOneArgs, Dto>, IItemHandler<T, Dto>
{
  protected readonly marshall = marshall;
  protected readonly unmarshall = unmarshall;
  protected readonly type: string;
  private readonly client: DynamoDB;
  private readonly tableName: string;
  private readonly fromItemRemove: (keyof IItem<T>)[];

  constructor({
    tableName,
    clientConfig = {},
    fromItemRemove = ['PK', 'SK', 'type'],
    type
  }: {
    tableName: string;
    clientConfig?: DynamoDBClientConfig;
    fromItemRemove?: (keyof IItem<T>)[];
    type: string;
  }) {
    this.client = getClient(clientConfig);
    this.tableName = tableName;
    this.fromItemRemove = fromItemRemove;
    this.type = type;
  }

  protected abstract pk(m: unknown): string;
  protected abstract sk?(m: unknown): string;

  public async list({
    limit = DEFAULT_LIMIT,
    nextToken,
    ...keyConditions
  }: IListArgs): Promise<IListResult<Dto>> {
    const {
      expressionAttributeNames,
      expressionAttributeValues,
      keyConditionExpression
    } = getQueryExpressions(keyConditions);
    const params = {
      TableName: this.tableName,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: keyConditionExpression,
      Limit: limit,
      ...((nextToken ? { ExclusiveStartKey: nextToken } : {}) as object)
    };

    try {
      const res = await this.client.query(params);
      const data = (res.Items || []).map((item) => this.fromItem(item));

      return {
        data,
        count: res.Count || 0,
        nextToken: res.LastEvaluatedKey as unknown as string
      };
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  public async findOne(m: FindOneArgs) {
    try {
      const res = await this.client.getItem({
        TableName: this.tableName,
        Key: this.keys(m)
      });

      if (!res.Item) {
        throw new DynamoErrorNotFound(
          `Not found entity with this values: ${JSON.stringify(m)}`
        );
      }

      return this.fromItem(res.Item);
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  public async create(m: Omit<T, 'createdAt' | 'updatedAt'>): Promise<Dto> {
    try {
      const time = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.client.putItem({
        TableName: this.tableName,
        Item: {
          ...this.toItem(m),
          ...this.marshall(time)
        },
        ConditionExpression: 'attribute_not_exists(SK)'
      });

      return {
        ...m,
        ...time
      } as Dto;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  public async update(m: FindOneArgs & Partial<T>) {
    try {
      const {
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
      } = getUpdateExpression({
        ...m,
        updatedAt: new Date().toISOString()
      });

      await this.client.updateItem({
        TableName: this.tableName,
        Key: this.keys(m),
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      });

      return this.findOne(m);
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  public async delete(m: FindOneArgs) {
    try {
      await this.client.deleteItem({
        TableName: this.tableName,
        Key: this.keys(m),
        ConditionExpression: 'attribute_exists(SK)'
      });

      return m;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  protected keys(m: unknown): {
    PK: AttributeValue.SMember;
    SK?: AttributeValue.SMember;
  } {
    return {
      PK: { S: this.pk(m) },
      ...(this.sk ? { SK: { S: this.sk(m) } } : {})
    };
  }

  public toItem(
    m: Omit<T, 'createdAt' | 'updatedAt'>
  ): Record<string, AttributeValue> {
    return this.marshall({
      PK: this.pk(m),
      ...(this.sk ? { SK: this.sk(m) } : {}),
      type: this.type,
      ...m
    });
  }

  public fromItem(item: Record<string, AttributeValue>): Dto {
    const data = this.unmarshall(item);

    return Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => !this.fromItemRemove.includes(key as keyof IItem<T>)
      )
    ) as Dto;
  }

  private handleError(error: unknown) {
    if (error instanceof DynamoErrorNotFound) {
      return error;
    } else if (error instanceof Error) {
      return new DynamoErrorUnknown(error.message);
    }

    return new DynamoErrorUnknown();
  }
}
