import {
  type CognitoIdentityProvider,
  type CreateGroupCommandInput
} from '@aws-sdk/client-cognito-identity-provider';

export interface IGroupServiceCreateInput
  extends Omit<
    CreateGroupCommandInput,
    'GroupName' | 'UserPoolId' | 'Description'
  > {
  name: string;
  description: string;
  options?: Parameters<CognitoIdentityProvider['createGroup']>[1];
}
