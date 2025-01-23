import { getQueryExpressions } from '../../src/utils/get-query-expressions';

const getExpressionAttributeValues = (value: string) => ({
  S: value
});

describe('utils/get-query-expressions - getQueryExpressions', () => {
  it('Should check the expression result', () => {
    const params = {
      pk: 'thisPk',
      sk: 'thisSk',
      beginsWith: 'thisBeginsWith',
      gt: 'thisGt',
      gte: 'thisGte',
      lt: 'thisLt',
      lte: 'thisLte',
      between: {
        from: '1',
        to: '10'
      }
    };
    const result = getQueryExpressions(params);
    const expected = {
      expressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK'
      },
      expressionAttributeValues: {
        ':pk': getExpressionAttributeValues(params.pk),
        ':sk': getExpressionAttributeValues(params.sk),
        ':beginsWith': getExpressionAttributeValues(params.beginsWith),
        ':gt': getExpressionAttributeValues(params.gt),
        ':gte': getExpressionAttributeValues(params.gte),
        ':lt': getExpressionAttributeValues(params.lt),
        ':lte': getExpressionAttributeValues(params.lte),
        ':from': getExpressionAttributeValues(params.between.from),
        ':to': getExpressionAttributeValues(params.between.to)
      },
      keyConditionExpression:
        '#pk = :pk AND #sk = :sk AND begins_with(#sk, :beginsWith) AND #sk > :gt AND #sk >= :gte AND #sk < :lt AND #sk <= :lte AND #sk BETWEEN :from AND :to'
    };

    expect(result).toEqual(expected);
  });
});
