export interface Service {
  id: string;
  title: string;
  description: string;
  photo?: string;
  price: number;
  duration: number;
  durationMax?: number;
  organizationId: string;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  photo?: string;
  price: number;
  duration: number;
  durationMax?: number;
  organizationId: string;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  photo?: string;
  price?: number;
  duration?: number;
  durationMax?: number;
}
