import api from './client';
import type { ApplicationPayload, ApplicationResult, Applicant, FilterParams } from '../types';

export const submitApplication = (link: string, data: ApplicationPayload): Promise<ApplicationResult> =>
  api.post(`/jobs/${link}/apply`, data).then((r) => r.data);

export const getApplications = (link: string, params?: FilterParams): Promise<Applicant[]> =>
  api.get(`/jobs/${link}/applications`, { params }).then((r) => r.data);
