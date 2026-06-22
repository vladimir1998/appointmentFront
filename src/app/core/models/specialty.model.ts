export interface Specialty {
  id: string;
  name: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpecialtyRequest {
  name: string;
  organizationId?: string;
}

export interface UpdateSpecialtyRequest {
  name?: string;
}
