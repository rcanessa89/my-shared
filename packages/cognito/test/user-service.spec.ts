import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { UserService } from '../src/services/user-service';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProvider: jest.fn().mockReturnValue({
    adminGetUser: jest.fn(),
    listUsers: jest.fn(),
    adminCreateUser: jest.fn(),
    adminDeleteUser: jest.fn(),
    adminEnableUser: jest.fn(),
    adminDisableUser: jest.fn()
  })
}));

const userPoolId = 'userPoolId';

describe('servies/user-service - UserService', () => {
  const service = new UserService({
    userPoolId
  });
  const mockClient = new CognitoIdentityProvider();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('Should call get user', async () => {
      const mockResult = { result: 1 };

      jest
        .spyOn(mockClient, 'adminGetUser')
        .mockImplementation(() => Promise.resolve(mockResult));

      const userName = 'userName';
      const result = await service.findOne({ userName });

      expect(mockClient.adminGetUser).toHaveBeenCalledTimes(1);
      expect(mockClient.adminGetUser).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          Username: userName
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('list', () => {
    it('Should call list users', async () => {
      const mockResult = { result: 2 };

      jest
        .spyOn(mockClient, 'listUsers')
        .mockImplementation(() => Promise.resolve(mockResult));

      const result = await service.list({});

      expect(mockClient.listUsers).toHaveBeenCalledTimes(1);
      expect(mockClient.listUsers).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('create', () => {
    it('Should call create user', async () => {
      const mockResult = { result: 3 };

      jest
        .spyOn(mockClient, 'adminCreateUser')
        .mockImplementation(() => Promise.resolve(mockResult));

      const userName = 'userName';
      const attrs = {
        name: 'nombre',
        'custom:role': 'admin'
      };
      const result = await service.create({
        userName,
        attrs
      });

      expect(mockClient.adminCreateUser).toHaveBeenCalledTimes(1);
      expect(mockClient.adminCreateUser).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          Username: userName,
          UserAttributes: [
            {
              Name: 'name',
              Value: 'nombre'
            },
            {
              Name: 'custom:role',
              Value: 'admin'
            }
          ]
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('delete', () => {
    it('Should call delete user', async () => {
      const mockResult = { result: 3 };

      jest
        .spyOn(mockClient, 'adminDeleteUser')
        .mockImplementation(() => Promise.resolve(mockResult));

      const userName = 'userName';
      const result = await service.delete({ userName });

      expect(mockClient.adminDeleteUser).toHaveBeenCalledTimes(1);
      expect(mockClient.adminDeleteUser).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          Username: userName
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('enable', () => {
    it('Should call enable user', async () => {
      const mockResult = { result: 4 };

      jest
        .spyOn(mockClient, 'adminEnableUser')
        .mockImplementation(() => Promise.resolve(mockResult));

      const userName = 'userName';
      const result = await service.enable({ userName });

      expect(mockClient.adminEnableUser).toHaveBeenCalledTimes(1);
      expect(mockClient.adminEnableUser).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          Username: userName
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('disable', () => {
    it('Should call disable user', async () => {
      const mockResult = { result: 5 };

      jest
        .spyOn(mockClient, 'adminDisableUser')
        .mockImplementation(() => Promise.resolve(mockResult));

      const userName = 'userName';
      const result = await service.disable({ userName });

      expect(mockClient.adminDisableUser).toHaveBeenCalledTimes(1);
      expect(mockClient.adminDisableUser).toHaveBeenLastCalledWith(
        {
          UserPoolId: userPoolId,
          Username: userName
        },
        undefined
      );
      expect(mockResult).toEqual(result);
    });
  });

  describe('mapAttrs', () => {
    it('Should map the attributes', () => {
      const attrs = [
        {
          Name: 'name',
          Value: 'nombre'
        },
        {
          Name: 'custom:role',
          Value: 'admin'
        }
      ];
      const result = service.mapAttrs(attrs);
      const expected = {
        name: 'nombre',
        role: 'admin'
      };

      expect(result).toEqual(expected);
    });
  });
});
