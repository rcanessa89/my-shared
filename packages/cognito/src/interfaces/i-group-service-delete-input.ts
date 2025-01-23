import {
  type CognitoIdentityProvider,
  type DeleteGroupCommandInput
} from '@aws-sdk/client-cognito-identity-provider';

export interface IGroupServiceDeleteInput
  extends Omit<DeleteGroupCommandInput, 'GroupName' | 'UserPoolId'> {
  name: string;
  options?: Parameters<CognitoIdentityProvider['deleteGroup']>[1];
}
