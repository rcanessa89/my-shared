import { type CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserServiceEnableInput {
  userName: string;
  options?: Parameters<CognitoIdentityProvider['adminEnableUser']>[1];
}
