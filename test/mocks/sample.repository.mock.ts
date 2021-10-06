import { BadGatewayException } from '@nestjs/common';
import { FindOneOptions, InsertResult } from 'typeorm';
import { AddSampleRequestDto, GetSampleResponseDto } from '../../src/api/modules/sample/dto/sample.dto';
import { Sample } from './../../src/database/entities/sample.entity';

export class SampleRepositoryMock {
  private samples: GetSampleResponseDto[] = [
    {
      id: 1,
      email: 'teste@teste.com',
      createdAt: new Date('2021-01-01T00:00:00Z300')
    },
  ];

  public async find(): Promise<GetSampleResponseDto[]> {
    return [
      { id: 1, email: 'teste@teste.com', createdAt: new Date('2020-02-02T00:00:00Z300') },
      { id: 2, email: 'teste1@teste.com', createdAt: new Date('2021-01-01T00:00:00Z300') },
    ];
  }

  public async findOne(options?: FindOneOptions<Sample>): Promise<unknown | undefined> {
    if (options.where['email'] === 'teste@teste.com' || options.where['id'] === 1) {
      return { id: 1, email: 'teste@teste.com', createdAt: new Date('2020-02-02T00:00:00Z300') };
    }
    return undefined;
  }

  public async save(sample: GetSampleResponseDto): Promise<GetSampleResponseDto> {
    return sample;
  }

  public async create(sampleData: AddSampleRequestDto): Promise<GetSampleResponseDto> {
    const { email } = sampleData;
    const newSample = {
      id: Math.floor(Math.random() * 1568578),
      email,
      createdAt: new Date()
    };

    this.samples.push(newSample);

    return newSample;
  }

  public async insert(sampleData: AddSampleRequestDto): Promise<InsertResult> {
    const newSample = await this.create(sampleData);

    return {
      identifiers: [newSample],
      generatedMaps: [],
      raw: [],
    }
  }

  public async update(id: number, sampleData: AddSampleRequestDto): Promise<unknown> {
    if (!id || !sampleData) throw new BadGatewayException('ID and sampleData are required');

    const user = this.samples.find((obj) => obj.id === id);
    if (user) {
      Object.keys(sampleData).map((key) => {
        user[key] = sampleData[key];
      });
    }

    return {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };
  }

  public async delete(id: number): Promise<unknown> {
    if (!id) throw new BadGatewayException('ID is required');

    const index = this.samples.findIndex((obj) => obj.id === id);

    if (index >= 0) {
      this.samples.splice(index, 1);
    }

    return {
      raw: [],
      affected: 1,
    };
  }
}
