export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface AuthenticationResult {
  accessToken: string;
  refreshToken: string;
  name: string;
  role: string;
}

export interface Authentication {
  auth(
    authentication: AuthenticationModel,
  ): Promise<AuthenticationResult | null>;
}
