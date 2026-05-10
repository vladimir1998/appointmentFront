export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  bio?: string;
  password?: string;
  globalPositionId?: string;
  globalPosition?: any;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  employees?: any;
  client?: any;
  refreshTokens?: any;
}
  