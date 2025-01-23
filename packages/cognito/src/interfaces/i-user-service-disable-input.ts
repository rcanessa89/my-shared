import { type CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserServiceDisableInput {
  userName: string;
  options?: Parameters<CognitoIdentityProvider['adminDisableUser']>[1];
}
