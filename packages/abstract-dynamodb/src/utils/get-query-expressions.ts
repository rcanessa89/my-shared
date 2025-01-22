import { type AttributeValue } from '@aws-sdk/client-dynamodb';
import { type IKeyConditionExpressions } from '../types';

const getConditionExp = (expression?: string) => {
  switch (expression) {
    case 'sk': {
      return `#sk = :${expression}`;
    }

    case 'beginsWith': {
      return `begins_with(#sk, :${expression})`;
    }

    case 'gt': {
      return `#sk > :${expression}`;
    }

    case 'gte': {
      return `#sk >= :${expression}`;
    }

    case 'lt': {
      return `#sk < :${expression}`;
    }

    case 'lte': {
      return `#sk <= :${expression}`;
    }

    case 'between': {
      return '#sk BETWEEN :from AND :to';
    }

    default: {
      return '';
    }
  }
};

export const getQueryExpressions = ({
  pk,
  sk,
  beginsWith,
  gt,
  gte,
  lt,
  lte,
  between
}: IKeyConditionExpressions) => {
  const expressionAttributeNames: {
    '#pk': string;
    '#sk'?: string;
  } = {
    '#pk': 'PK'
  };
  const expressionAttributeValues: Record<string, AttributeValue> = {
    ':pk': {
      S: pk
    }
  };
  const keyConditionExpressionArr = ['#pk = :pk'];
  const condExpr = {
    sk,
    beginsWith,
    gt,
    gte,
    lt,
    lte,
    between
  };
  const condExprEntries = Object.entries(condExpr).filter(([, value]) =>
    Boolean(value)
  );

  if (!condExprEntries.length) {
    return {
      expressionAttributeNames,
      expressionAttributeValues,
      keyConditionExpression: '#pk = :pk'
    };
  }

  expressionAttributeNames['#sk'] = 'SK';

  condExprEntries.map(([key, value]) => {
    if (typeof value === 'string') {
      expressionAttributeValues[`:${key}`] = {
        S: value
      };
      keyConditionExpressionArr.push(getConditionExp(key));
    } else if (value?.from && value?.to) {
      expressionAttributeValues[':from'] = {
        S: value?.from
      };
      expressionAttributeValues[':to'] = {
        S: value.to
      };
      keyConditionExpressionArr.push(getConditionExp());
    }
  });

  const keyConditionExpression = keyConditionExpressionArr.join(' AND ');

  return {
    expressionAttributeNames,
    expressionAttributeValues,
    keyConditionExpression
  };
};
