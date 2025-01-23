import {
  type CognitoIdentityProvider,
  type AdminAddUserToGroupCommandInput
} from '@aws-sdk/client-cognito-identity-provider';

export interface IGroupServiceAddInput
  extends Omit<
    AdminAddUserToGroupCommandInput,
    'GroupName' | 'UserPoolId' | 'Username'
  > {
  name: string;
  userName: string;
  options?: Parameters<CognitoIdentityProvider['adminAddUserToGroup']>[1];
}
