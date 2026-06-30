import { Employee } from "./employee.model";

export type PriceType = 'exact' | 'approximate' | 'from' | 'range';

export interface Service {
  id: string;
  title: string;
  description: string;
  photo?: string;
  price: number;
  priceMax?: number;
  priceType?: PriceType;
  priceComment?: string;
  duration: number;
  durationMax?: number;
  about?: string[];
  organizationId: string;
  employees?: Employee[];
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  photo?: string;
  price: number;
  priceMax?: number;
  priceType?: PriceType;
  priceComment?: string;
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
  priceMax?: number;
  priceType?: PriceType;
  priceComment?: string;
  duration?: number;
  durationMax?: number;
  about?: string[];
  employeeIds?: string[];
}
