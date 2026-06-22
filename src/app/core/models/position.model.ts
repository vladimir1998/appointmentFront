export interface PositionPermission {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export interface Position {
  id: string;
  name: string;
  permissions: PositionPermission[];
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
