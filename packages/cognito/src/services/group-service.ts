import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { type ICognitoCreateGroup } from '../interfaces/i-group-service';
import { type IGroupServiceCreateInput } from '../interfaces/i-group-service-create-input';
import { type IGroupServiceAddInput } from '../interfaces/i-group-service-add-input';
import { type IGroupServiceDeleteInput } from '../interfaces/i-group-service-delete-input';

export interface IGroupServiceOptions {
  options?: ConstructorParameters<typeof CognitoIdentityProvider>[0];
  userPoolId: string;
}

export class GroupService implements ICognitoCreateGroup {
  private provider: CognitoIdentityProvider;
  private userPoolId: string;

  constructor({ options = {}, userPoolId }: IGroupServiceOptions) {
    this.provider = new CognitoIdentityProvider(options);
    this.userPoolId = userPoolId;
  }

  public create({
    name,
    description,
    options,
    ...restArgs
  }: IGroupServiceCreateInput) {
    return this.provider.createGroup(
      {
        UserPoolId: this.userPoolId,
        GroupName: name,
        Description: description,
        ...restArgs
      },
      options
    );
  }

  public add({ name, userName, options, ...restArgs }: IGroupServiceAddInput) {
    return this.provider.adminAddUserToGroup(
      {
        UserPoolId: this.userPoolId,
        GroupName: name,
        Username: userName,
        ...restArgs
      },
      options
    );
  }

  public delete({ name, options, ...restArgs }: IGroupServiceDeleteInput) {
    return this.provider.deleteGroup(
      {
        UserPoolId: this.userPoolId,
        GroupName: name,
        ...restArgs
      },
      options
    );
  }
}
