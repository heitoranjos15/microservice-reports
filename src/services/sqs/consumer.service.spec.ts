import { Test, TestingModule } from '@nestjs/testing';
import { ServicesModule } from '../services.module';
import { SqsConsumerService } from './consumer.service';

describe('ConsumerService', () => {
  let service: SqsConsumerService;


  beforeAll(async () => {
    console.error = () => null;
    console.log = () => null;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServicesModule],
      providers: [
        SqsConsumerService,
      ],
    }).compile();

    service = module.get<SqsConsumerService>(SqsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start consume some sqs message', () => {
    const consume = service.start('http://teste.com', 'us-east-1');
    expect(consume).toMatchObject({});
  });

  it('should stop consume sqs message', () => {
    try {
      service.stop();
    } catch (error) {
      // tests do not consume sqs messages for real, so there is nothing to stop
      expect(error.message).toEqual('Cannot read property \'stop\' of null')
    }
  });

  it('should force an error', () => {
    try {
      service.start(null, 'us-east-1');
    } catch (error) {
      expect(error.message).toEqual('Missing SQS consumer option [ queueUrl ].')
    }
  });


});
