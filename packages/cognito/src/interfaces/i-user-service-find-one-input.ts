import { type CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserServiceFindOneInput {
  userName: string;
  options?: Parameters<CognitoIdentityProvider['adminGetUser']>[1];
}
