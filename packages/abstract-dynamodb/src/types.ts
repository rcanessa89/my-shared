import { type AttributeValue } from '@aws-sdk/client-dynamodb';

export interface IListArgs extends IKeyConditionExpressions {
  limit?: number;
  nextToken?: string;
}

export interface IListResult<T> {
  nextToken?: string;
  count: number;
  data: T[];
}

export interface IKeyConditionExpressions {
  pk: string;
  sk?: string;
  beginsWith?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  between?: {
    from: string;
    to: string;
  };
}

export type IItem<T> = T & {
  PK: string;
  SK: string;
  type: string;
};

export interface IModelDTO {
  createdAt: string;
  updatedAt: string;
}

export interface IItemHandler<T, Dto = T & IModelDTO> {
  toItem(m: T): Record<string, AttributeValue>;
  fromItem(item: Record<string, AttributeValue>): Dto;
}

export interface IDynamoService<T, FindOneArgs, Dto = T & IModelDTO> {
  list(args: IListArgs): Promise<IListResult<Dto>>;
  findOne(args: FindOneArgs): Promise<Dto | null>;
  create(args: T): Promise<Dto>;
  update(args: FindOneArgs): Promise<Dto>;
  delete(args: FindOneArgs): Promise<FindOneArgs>;
}
