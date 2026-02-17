import { SubjectAttributes } from '../../models/Subject';

export interface CreateSubjectRequest {
  name: string;
  semester: '1st' | '2nd' | 'yearly';
}

export interface UpdateSubjectRequest {
  name?: string;
  semester?: '1st' | '2nd' | 'yearly';
}

export interface SubjectResponse extends SubjectAttributes {
  weeks?: WeekResponse[];
  semesterStartDate?: string; // ISO date string for the semester start
}

export interface WeekResponse {
  id: number;
  weekNumber: number;
  content: string;
  resources?: ResourceResponse[];
}

export interface ResourceResponse {
  id: number;
  url: string;
  title?: string;
  description?: string;
}
