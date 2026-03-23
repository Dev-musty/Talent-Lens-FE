import api from './client';
import type { CreateJobPayload, CreateJobResponse, Job } from '../types';

export const createJob = (data: CreateJobPayload): Promise<CreateJobResponse> =>
  api.post('/jobs', data).then((r) => r.data);

export const getJob = (link: string): Promise<Job> =>
  api.get(`/jobs/${link}`).then((r) => r.data);
