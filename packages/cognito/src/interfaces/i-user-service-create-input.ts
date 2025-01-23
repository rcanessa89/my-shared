import {
  type AdminCreateUserCommandInput,
  type CognitoIdentityProvider
} from '@aws-sdk/client-cognito-identity-provider';

export interface UserServiceCreateInput
  extends Omit<
    AdminCreateUserCommandInput,
    'UserPoolId' | 'Username' | 'UserAttributes'
  > {
  userName: string;
  attrs: Record<string, string>;
  options?: Parameters<CognitoIdentityProvider['adminCreateUser']>[1];
}
