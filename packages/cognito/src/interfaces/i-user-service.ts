import {
  type AdminDeleteUserCommandOutput,
  type AdminCreateUserCommandOutput,
  type AdminGetUserCommandOutput,
  type ListUsersCommandOutput,
  type AdminEnableUserCommandOutput,
  type AdminDisableUserCommandOutput,
  type AttributeType
} from '@aws-sdk/client-cognito-identity-provider';

import { type IUserServiceFindOneInput } from './i-user-service-find-one-input';
import { type UserServiceCreateInput } from './i-user-service-create-input';
import { type IUserServiceListInput } from './i-user-service-list-input';
import { type IUserServiceDeleteInput } from './i-user-service-delete-input';
import { type IUserServiceEnableInput } from './i-user-service-enable-input';
import { type IUserServiceDisableInput } from './i-user-service-disable-input';

export interface IUserService {
  findOne(args: IUserServiceFindOneInput): Promise<AdminGetUserCommandOutput>;
  list(args: IUserServiceListInput): Promise<ListUsersCommandOutput>;
  create(args: UserServiceCreateInput): Promise<AdminCreateUserCommandOutput>;
  delete(args: IUserServiceDeleteInput): Promise<AdminDeleteUserCommandOutput>;
  enable(args: IUserServiceEnableInput): Promise<AdminEnableUserCommandOutput>;
  disable(
    args: IUserServiceDisableInput
  ): Promise<AdminDisableUserCommandOutput>;
  mapAttrs<T = object>(attrs: AttributeType[]): T;
}
