import {
  type AdminAddUserToGroupCommandOutput,
  type CreateGroupCommandOutput,
  type DeleteGroupCommandOutput
} from '@aws-sdk/client-cognito-identity-provider';

import { type IGroupServiceCreateInput } from './i-group-service-create-input';
import { type IGroupServiceAddInput } from './i-group-service-add-input';
import { type IGroupServiceDeleteInput } from './i-group-service-delete-input';

export interface ICognitoCreateGroup {
  create(args: IGroupServiceCreateInput): Promise<CreateGroupCommandOutput>;
  add(args: IGroupServiceAddInput): Promise<AdminAddUserToGroupCommandOutput>;
  delete(args: IGroupServiceDeleteInput): Promise<DeleteGroupCommandOutput>;
}
