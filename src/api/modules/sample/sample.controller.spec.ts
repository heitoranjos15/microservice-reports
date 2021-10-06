import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SampleRepositoryMock } from '../../../../test/mocks/sample.repository.mock';
import { Sample } from '../../../database/entities/sample.entity';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

describe('SampleController', () => {
  let controller: SampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleController],
      providers: [
        SampleService,
        {
          provide: getRepositoryToken(Sample),
          useClass: SampleRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<SampleController>(SampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
