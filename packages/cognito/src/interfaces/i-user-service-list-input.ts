import {
  type CognitoIdentityProvider,
  type ListUsersCommandInput
} from '@aws-sdk/client-cognito-identity-provider';

export interface IUserServiceListInput
  extends Omit<ListUsersCommandInput, 'UserPoolId'> {
  options?: Parameters<CognitoIdentityProvider['listUsers']>[1];
}
