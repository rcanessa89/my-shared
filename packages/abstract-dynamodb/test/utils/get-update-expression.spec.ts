import { getUpdateExpression } from '../../src/utils/get-update-expression';

const getExpressionAttributeValues = (value: string) => ({
  S: value
});

describe('utils/get-update-expression - getUpdateExpression', () => {
  it('Should check the expression result', () => {
    const params = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: 'prop3'
    };
    const entries = Object.entries(params);
    const result = getUpdateExpression(params);
    const expected = {
      expressionAttributeNames: {
        ...entries.reduce((acc, [key, value]) => {
          acc[`#${key}`] = value;

          return acc;
        }, {} as Record<string, string>)
      },
      expressionAttributeValues: {
        ...entries.reduce((acc, [key, value]) => {
          acc[`:${key}`] = getExpressionAttributeValues(value);

          return acc;
        }, {} as Record<string, { S: string }>)
      },
      updateExpression: 'set #prop1 = :prop1, #prop2 = :prop2, #prop3 = :prop3'
    };

    expect(result).toEqual(expected);
  });
});
