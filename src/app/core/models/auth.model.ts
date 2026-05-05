export interface User {
  id: string;
  email: string;
  globalRole: string;
  isEmployee: boolean;
  employees: unknown[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
}
