export class DynamoErrorNotFound extends Error {
  constructor(message = 'Not found') {
    super(message);
  }
}

export class DynamoErrorUnknown extends Error {
  constructor(message = 'Unknown error') {
    super(message);
  }
}
