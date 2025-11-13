import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import type { JobProcessor } from './types';
import { getBullQueueOptions } from './config';

class QueueManager {
  private queues = new Map<string, Queue>();
  private processors = new Map<string, Map<string, JobProcessor>>();
  private workers = new Map<string, Worker>();

  /** Create or reuse a BullMQ queue */
  createQueue(name: string): Queue {
    if (this.queues.has(name)) return this.queues.get(name)!;

    const queue = new Queue(name, getBullQueueOptions());

    // Queue lifecycle events
    const events = new QueueEvents(name, getBullQueueOptions());
    // events.on('failed', ({ jobId, failedReason }) =>
    //   strapi.log.error(`[Queue:${name}] Job ${jobId} failed: ${failedReason}`),
    // );
    // events.on('completed', ({ jobId }) =>
    //   strapi.log.debug(`[Queue:${name}] ✅ Job ${jobId} completed`),
    // );

    this.queues.set(name, queue);
    this.processors.set(name, new Map());

    strapi.log.info(`[Queue:${name}] Queue created`);
    return queue;
  }

  /** Register a processor for a specific job name */
  registerProcessor(
    queueName: string,
    jobName: string,
    processor: JobProcessor,
    concurrency = 1,
  ): void {
    this.createQueue(queueName);
    const jobProcessors = this.processors.get(queueName)!;
    jobProcessors.set(jobName, processor);

    if (!this.workers.has(queueName)) {
      const worker = new Worker(
        queueName,
        async (job: Job) => {
          const handler = this.processors.get(queueName)?.get(job.name as string);
          if (!handler) {
            strapi.log.warn(`[${queueName}] No processor for "${job.name}"`);
            return;
          }

          strapi.log.debug(`[${queueName}:${job.name}] Processing job ${job.id}`);
          await handler.process(job);
        },
        { ...getBullQueueOptions(), concurrency },
      );
      this.workers.set(queueName, worker);
      strapi.log.info(`[Queue:${queueName}] Worker started`);
    }
  }

  /** Get queue instance */
  getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  /** Gracefully shut down all queues and workers */
  async closeAll(): Promise<void> {
    await Promise.all([
      ...[...this.workers.values()].map((w) => w.close()),
      ...[...this.queues.values()].map((q) => q.close()),
    ]);
    this.workers.clear();
    this.queues.clear();
    this.processors.clear();
    strapi.log.info('[QueueManager] All queues closed');
  }
}

export const queueManager = new QueueManager();
