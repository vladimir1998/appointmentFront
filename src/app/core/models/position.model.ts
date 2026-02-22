export interface Position {
  id: string;
  name: string;
  permissions: string[];
  organizationId: string;
}

export interface CreatePositionRequest {
  name: string;
  permissions: string[];
  organizationId: string;
}

export interface UpdatePositionRequest {
  name?: string;
  permissions?: string[];
}
