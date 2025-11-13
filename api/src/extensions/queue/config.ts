import { JobsOptions, QueueOptions } from 'bullmq';
import { redisClient } from '../../util/redisClient';


export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  removeOnComplete: true,
  removeOnFail: { age: 24 * 3600 },
  attempts: 3,
  backoff: { type: 'fixed', delay: 300_000 },
};

export const getBullQueueOptions = (): QueueOptions => ({
  connection: redisClient,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});
