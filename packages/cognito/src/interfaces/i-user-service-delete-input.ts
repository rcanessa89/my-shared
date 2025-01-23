import { type CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserServiceDeleteInput {
  userName: string;
  options?: Parameters<CognitoIdentityProvider['adminDeleteUser']>[1];
}
