import { DynamoModel } from '../src/dynamo-model';

describe('DynamoModel', () => {
  it('Should has all properties', () => {
    const data = {
      id: 'id',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    };
    const model = new DynamoModel(data);

    expect(model).toEqual(data);
  });
});
