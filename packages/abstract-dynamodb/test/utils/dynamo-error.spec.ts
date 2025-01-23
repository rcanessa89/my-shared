import {
  DynamoErrorNotFound,
  DynamoErrorUnknown
} from '../../src/utils/dynamo-error';

describe('utils/dynamo-error - DynamoErrorNotFound', () => {
  it('Should be an Error instance', () => {
    const instance = new DynamoErrorNotFound();

    expect(instance).toBeInstanceOf(Error);
  });

  it('Should check the error message', () => {
    const message = 'not found message';
    const instance1 = new DynamoErrorNotFound();
    const instance2 = new DynamoErrorNotFound(message);

    expect(instance1.message).toEqual('Not found');
    expect(instance2.message).toEqual(message);
  });
});

describe('utils/dynamo-error - DynamoErrorUnknown', () => {
  it('Should be an Error instance', () => {
    const instance = new DynamoErrorUnknown();

    expect(instance).toBeInstanceOf(Error);
  });

  it('Should check the error message', () => {
    const message = 'unknown error message';
    const instance1 = new DynamoErrorUnknown();
    const instance2 = new DynamoErrorUnknown(message);

    expect(instance1.message).toEqual('Unknown error');
    expect(instance2.message).toEqual(message);
  });
});
