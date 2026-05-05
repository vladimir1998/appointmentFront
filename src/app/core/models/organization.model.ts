export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  logo?: string;
}
