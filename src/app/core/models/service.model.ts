import { Employee } from "./employee.model";

export interface Service {
  id: string;
  title: string;
  description: string;
  photo?: string;
  price: number;
  duration: number;
  durationMax?: number;
  about?: string[];
  organizationId: string;
  employee?: Employee[];
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  photo?: string;
  price: number;
  duration: number;
  durationMax?: number;
  about?: string[];
  organizationId: string;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  photo?: string;
  price?: number;
  duration?: number;
  durationMax?: number;
  about?: string[];
}
