import {
  DynamoErrorNotFound,
  DynamoErrorUnknown
} from '../../src/utils/dynamo-error';

describe('utils/dynamo-error - DynamoErrorNotFound', () => {
  it('Should be an Error instance', () => {
    const instance = new DynamoErrorNotFound();

    expect(instance).toBeInstanceOf(Error);
  });
});

describe('utils/dynamo-error - DynamoErrorUnknown', () => {
  it('Should be an Error instance', () => {
    const instance = new DynamoErrorUnknown();

    expect(instance).toBeInstanceOf(Error);
  });
});
