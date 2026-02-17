import { WeekAttributes, ResourceAttributes } from '../../models';

export interface UpdateWeekRequest {
  content: string;
}

export interface CreateResourceRequest {
  url: string;
  title?: string;
  description?: string;
}

export interface UpdateResourceRequest {
  url?: string;
  title?: string;
  description?: string;
}

export interface WeekResponse extends WeekAttributes {
  resources?: ResourceResponse[];
}

export interface ResourceResponse extends ResourceAttributes {}
