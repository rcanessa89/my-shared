import { type IDynamoModel } from './types';

export class DynamoModel implements IDynamoModel {
  public id: string;
  public createdAt: string;
  public updatedAt: string;

  constructor({
    id,
    createdAt,
    updatedAt
  }: {
    id: string;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
