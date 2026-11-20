export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}