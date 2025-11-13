import { queueManager } from './extensions/queue';
import { MAIL_QUEUE } from './extensions/queue/queues/mail/constants';
import { registerMailProcessors } from './extensions/queue/queues/mail/processor';

export default {
  register() {},
  async bootstrap() {
     
    queueManager.createQueue(MAIL_QUEUE);
    
    registerMailProcessors();
  },
};



