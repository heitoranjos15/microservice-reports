import { Injectable } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class SqsConsumerService {

  private queue: Consumer = null;

  private handleError(error) {
    console.error(error);
  }

  public start(queueUrl: string, region: string): Consumer {

    if (this.queue) {
      return this.queue;
    }

    this.queue = Consumer.create({
      queueUrl,
      region,
      batchSize: 10,
      visibilityTimeout: 60,
      handleMessage: async (message) => {
        const body = JSON.parse(message.Body);
        console.log('body sqs: ', body);
        /**
         * Treat your message here
         */
      },
    });
    this.queue.on('error', this.handleError);
    this.queue.on('processing_error', this.handleError);

    if (process.env.NO_CONSUME === 'true') {
      console.log('Consumers não iniciados, NO_CONSUME = true');
    } else {
      console.info('Inicializando Consumer das Queues de integração');
      console.info('Para não consumir os hooks utilizar a env NO_CONSUME=true');
      this.queue.start();
    }

    return this.queue;

  }

  public stop() {
    this.queue.stop();
  }
}
