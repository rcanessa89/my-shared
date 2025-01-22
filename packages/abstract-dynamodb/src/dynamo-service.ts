import {
  DynamoDB,
  type DynamoDBClientConfig,
  type AttributeValue
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { getClient } from './utils/get-client';
import { getQueryExpressions } from './utils/get-query-expressions';
import { getUpdateExpression } from './utils/get-update-expression';
import { DynamoErrorNotFound, DynamoErrorUnknown } from './utils/dynamo-error';
import { DEFAULT_LIMIT } from './constants';
import {
  type IListArgs,
  type IDynamoService,
  type IListResult,
  type IDynamoModel
} from './types';

export abstract class DynamoService<
  T extends IDynamoModel,
  FindOneArgs extends Partial<T>
> implements IDynamoService<T, IListArgs, IListResult<T>>
{
  private readonly client: DynamoDB;
  private readonly tableName: string;

  constructor({
    tableName,
    clientConfig = {}
  }: {
    tableName: string;
    clientConfig?: DynamoDBClientConfig;
  }) {
    this.client = getClient(clientConfig);
    this.tableName = tableName;
  }

  protected abstract pk(m: FindOneArgs): string;
  protected abstract sk(m: FindOneArgs): string;
  protected abstract toItem(m: T): Record<string, AttributeValue>;
  protected abstract fromItem(
    item: Record<string, AttributeValue> | undefined
  ): T;

  public async list({
    limit = DEFAULT_LIMIT,
    nextToken,
    ...keyConditions
  }: IListArgs): Promise<IListResult<T>> {
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

  public async create(m: T) {
    try {
      await this.client.putItem({
        TableName: this.tableName,
        Item: {
          ...this.toItem(m),
          ...marshall({
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        },
        ConditionExpression: 'attribute_not_exists(SK)'
      });

      return m;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  public async update(m: FindOneArgs & Partial<T>) {
    try {
      await this.client.updateItem({
        TableName: this.tableName,
        Key: this.keys(m),
        ...getUpdateExpression({
          ...m,
          updatedAt: new Date().toISOString()
        } as Record<string, unknown>)
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

  protected keys(m: FindOneArgs): Record<string, AttributeValue> {
    return {
      PK: { S: this.pk(m) },
      SK: { S: this.sk(m) }
    };
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
