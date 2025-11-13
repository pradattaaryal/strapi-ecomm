import { Job, Queue, JobsOptions } from 'bullmq';

export interface QueueConfig {
  name: string;
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  defaultJobOptions?: JobsOptions;
}

export interface JobProcessor<T = any> {
  process(job: Job): Promise<void>;
}

export interface QueueProducer<T = any> {
  addJob(data: T, options?: JobsOptions): Promise<Job>;
}