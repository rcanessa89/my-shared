export interface IListArgs extends IKeyConditionExpressions {
  limit?: number;
  nextToken?: string;
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

export type ModelArgs<T> = Omit<Partial<T>, 'type'>;

export interface IDynamoModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDynamoService<T, ListArgs, ListResult extends { data: T[] }> {
  list(args: ListArgs): Promise<ListResult>;
  findOne(args: Partial<T>): Promise<T | null>;
  create(args: T): Promise<T>;
  update(args: Partial<T>): Promise<T>;
  delete(args: Partial<T>): Promise<Partial<T>>;
}

export interface IListResult<T> {
  nextToken?: string;
  count: number;
  data: T[];
}
