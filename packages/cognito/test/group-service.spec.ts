import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { GroupService } from '../src/services/group-service';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProvider: jest.fn().mockReturnValue({
    createGroup: jest.fn(),
    adminAddUserToGroup: jest.fn(),
    deleteGroup: jest.fn()
  })
}));

const userPoolId = 'userPoolId';

describe('servies/group-service - GroupService', () => {
  const service = new GroupService({
    userPoolId
  });
  const mockClient = new CognitoIdentityProvider();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Should call add user to group', async () => {
      const mockResult = { result: 1 };

      jest
        .spyOn(mockClient, 'createGroup')
        .mockImplementation(() => Promise.resolve(mockResult));

      const name = 'name';
      const description = 'description';
      const result = await service.create({
        name,
        description
      });

      expect(mockClient.createGroup).toHaveBeenCalledTimes(1);
      expect(mockClient.createGroup).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          GroupName: name,
          Description: description
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('add', () => {
    it('Should call add user to group', async () => {
      const mockResult = { result: 2 };

      jest
        .spyOn(mockClient, 'adminAddUserToGroup')
        .mockImplementation(() => Promise.resolve(mockResult));

      const name = 'name';
      const userName = 'userName';
      const result = await service.add({
        name,
        userName
      });

      expect(mockClient.adminAddUserToGroup).toHaveBeenCalledTimes(1);
      expect(mockClient.adminAddUserToGroup).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          GroupName: name,
          Username: userName
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('delete', () => {
    it('Should call delete group', async () => {
      const mockResult = { result: 3 };

      jest
        .spyOn(mockClient, 'deleteGroup')
        .mockImplementation(() => Promise.resolve(mockResult));

      const name = 'name';
      const result = await service.delete({
        name
      });

      expect(mockClient.deleteGroup).toHaveBeenCalledTimes(1);
      expect(mockClient.deleteGroup).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          GroupName: name
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });
});
