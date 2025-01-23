import {
  CognitoIdentityProvider,
  type AttributeType
} from '@aws-sdk/client-cognito-identity-provider';

import { type IUserService } from '../interfaces/i-user-service';
import { type IUserServiceFindOneInput } from '../interfaces/i-user-service-find-one-input';
import { type UserServiceCreateInput } from '../interfaces/i-user-service-create-input';
import { type IUserServiceListInput } from '../interfaces/i-user-service-list-input';
import { type IUserServiceDeleteInput } from '../interfaces/i-user-service-delete-input';
import { type IUserServiceEnableInput } from '../interfaces/i-user-service-enable-input';
import { type IUserServiceDisableInput } from '../interfaces/i-user-service-disable-input';

export interface IUserServiceOptions {
  options?: ConstructorParameters<typeof CognitoIdentityProvider>[0];
  userPoolId: string;
}

export class UserService implements IUserService {
  private provider: CognitoIdentityProvider;
  private userPoolId: string;

  constructor({ options = {}, userPoolId }: IUserServiceOptions) {
    this.provider = new CognitoIdentityProvider(options);
    this.userPoolId = userPoolId;
  }

  public findOne({ userName, options }: IUserServiceFindOneInput) {
    return this.provider.adminGetUser(
      {
        UserPoolId: this.userPoolId,
        Username: userName
      },
      options
    );
  }

  public list({ options, ...restArgs }: IUserServiceListInput) {
    return this.provider.listUsers(
      {
        UserPoolId: this.userPoolId,
        ...restArgs
      },
      options
    );
  }

  public create({
    userName,
    attrs,
    options,
    ...restOptions
  }: UserServiceCreateInput) {
    return this.provider.adminCreateUser(
      {
        UserPoolId: this.userPoolId,
        Username: userName,
        UserAttributes: Object.entries(attrs).map(([Name, Value]) => ({
          Name,
          Value
        })),
        ...restOptions
      },
      options
    );
  }

  public delete({ userName, options }: IUserServiceDeleteInput) {
    return this.provider.adminDeleteUser(
      {
        UserPoolId: this.userPoolId,
        Username: userName
      },
      options
    );
  }

  public enable({ userName, options }: IUserServiceEnableInput) {
    return this.provider.adminEnableUser(
      {
        UserPoolId: this.userPoolId,
        Username: userName
      },
      options
    );
  }

  public disable({ userName, options }: IUserServiceDisableInput) {
    return this.provider.adminDisableUser(
      {
        UserPoolId: this.userPoolId,
        Username: userName
      },
      options
    );
  }

  public mapAttrs<T = object>(attrs: AttributeType[]): T {
    return Object.fromEntries(
      (attrs || []).map(({ Name, Value }) => {
        const formattedName = Name?.includes(':') ? Name?.split(':')[1] : Name;

        return [formattedName, Value];
      })
    );
  }
}
