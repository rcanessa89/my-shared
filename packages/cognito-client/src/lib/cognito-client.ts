import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  type ICognitoUserPoolData,
  type CognitoUserSession,
  type NodeCallback,
  type IAuthenticationCallback
} from 'amazon-cognito-identity-js';

export class CognitoClient {
  public cognitoUserPool: CognitoUserPool;

  constructor({
    poolConfig,
    wrapRefreshSessionCallback
  }: {
    poolConfig: ICognitoUserPoolData;
    wrapRefreshSessionCallback?: (target: NodeCallback.Any) => NodeCallback.Any;
  }) {
    this.cognitoUserPool = new CognitoUserPool(
      poolConfig,
      wrapRefreshSessionCallback
    );
  }

  public getSession(): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const user = this.cognitoUserPool.getCurrentUser();

      if (user) {
        user.getSession(
          (error: Error | null, session: CognitoUserSession | null) => {
            if (error) {
              reject(error);
            } else if (session) {
              resolve(session);
            }
          }
        );
      } else {
        reject(new Error('No user'));
      }
    });
  }

  public authenticate({
    username,
    password,
    callback
  }: {
    username: string;
    password: string;
    callback: IAuthenticationCallback;
  }) {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.cognitoUserPool
    });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    cognitoUser.authenticateUser(authDetails, callback);
  }

  public newPasswordRequired({
    password,
    newPasswordRequiredData
  }: {
    password: string;
    newPasswordRequiredData: {
      data: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
      cognitoUser: CognitoUser;
    };
  }): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const { data, cognitoUser } = newPasswordRequiredData as {
        data: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
        cognitoUser: CognitoUser;
      };

      cognitoUser.completeNewPasswordChallenge(password, data, {
        onSuccess: resolve,
        onFailure: reject
      });
    });
  }

  public forgotPassword(username: string) {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: this.cognitoUserPool
      });

      cognitoUser.forgotPassword({
        onSuccess: resolve,
        onFailure: reject
      });
    });
  }

  public confirmPassword({
    code,
    newPassword,
    confirmPassUsername
  }: {
    code: string;
    newPassword: string;
    confirmPassUsername: string;
  }) {
    return new Promise<string>((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: confirmPassUsername,
        Pool: this.cognitoUserPool
      });

      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: resolve,
        onFailure: reject
      });
    });
  }

  public logout() {
    const user = this.cognitoUserPool.getCurrentUser();

    if (user) {
      user.signOut();
    }
  }

  public getCognitoToken() {
    return new Promise((resolve, reject) => {
      const user = this.cognitoUserPool.getCurrentUser();

      if (!user) {
        return reject(new Error('No current user'));
      }

      user.getSession((error: Error, session: CognitoUserSession | null) => {
        if (error) {
          reject(error);
        } else if (session) {
          const token = session.getIdToken().getJwtToken();

          resolve(token);
        }
      });
    });
  }
}
