const {
  DynamoDBClient,
  CreateTableCommand
} = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://dynamodb:8000',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
  }
});

const params = {
  TableName: 'ipf-local',
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'S'
    },
    {
      AttributeName: 'SK',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

const createTableCommand = new CreateTableCommand(params);

(async () => {
  try {
    const data = await dynamoDBClient.send(createTableCommand);
    console.log('Table created successfully:', data);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error(
        'Unable to create table. Error JSON:',
        JSON.stringify(err, null, 2)
      );
    }
  }
})();
