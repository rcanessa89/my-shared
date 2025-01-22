import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { convertToAttr } from '@aws-sdk/util-dynamodb';

export const getUpdateExpression = (data: Record<string, unknown>) => {
  const initValue = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {} as Record<string, string>,
    ExpressionAttributeValues: {} as Record<string, AttributeValue>
  };
  const result = Object.entries(data).reduce((acc, [attr, val]) => {
    const attrName = `#${attr}`;
    const attrValue = `:${attr}`;

    acc.UpdateExpression = `${acc.UpdateExpression} ${attrName} = ${attrValue},`;
    acc.ExpressionAttributeNames[attrName] = attr;
    acc.ExpressionAttributeValues[attrValue] = convertToAttr(val);

    return acc;
  }, initValue);

  result.UpdateExpression = result.UpdateExpression.slice(0, -1);

  return result;
};
