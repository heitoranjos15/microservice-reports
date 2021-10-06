import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SampleRepositoryMock } from '../../../../test/mocks/sample.repository.mock';
import { Sample } from '../../../database/entities/sample.entity';
import { SampleService } from './sample.service';

describe('SampleService', () => {
  let service: SampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SampleService,
        {
          provide: getRepositoryToken(Sample),
          useClass: SampleRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<SampleService>(SampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all samples', async () => {
    const res = await service.getAll();

    expect(res.length).toBeGreaterThan(0);
  });

  it('should get one sample', async () => {
    const res = await service.findOne('teste@teste.com');

    expect(res.id).toEqual(1);
  });

  it('should create a new sample', async () => {
    const sampleData = {
      email: 'teste200@teste.com',
    };

    const res = await service.create(sampleData);

    expect(res.identifiers[0].email).toEqual('teste200@teste.com');
  });

  it('should change the email of a sample', async () => {
    const sampleData = {
      email: 'teste300@teste.com',
    };

    const res = await service.update(1, sampleData);

    expect(res.affected).toEqual(1);
  });

  it('should remove a sample', async () => {
    const res = await service.remove(1);

    expect(res.affected).toEqual(1);
  });
});
