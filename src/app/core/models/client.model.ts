export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  notes?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  notes?: string;
  userId?: string;
  organizationId: string;
}
