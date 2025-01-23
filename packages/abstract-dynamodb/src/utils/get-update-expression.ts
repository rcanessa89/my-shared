import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { convertToAttr } from '@aws-sdk/util-dynamodb';

export const getUpdateExpression = (data: Record<string, unknown>) => {
  const initValue = {
    updateExpression: 'set',
    expressionAttributeNames: {} as Record<string, string>,
    expressionAttributeValues: {} as Record<string, AttributeValue>
  };
  const result = Object.entries(data).reduce((acc, [attr, val]) => {
    const attrName = `#${attr}`;
    const attrValue = `:${attr}`;

    acc.updateExpression = `${acc.updateExpression} ${attrName} = ${attrValue},`;
    acc.expressionAttributeNames[attrName] = attr;
    acc.expressionAttributeValues[attrValue] = convertToAttr(val);

    return acc;
  }, initValue);

  result.updateExpression = result.updateExpression.slice(0, -1);

  return result;
};
