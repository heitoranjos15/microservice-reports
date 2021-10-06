import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Sample } from '../../../database/entities/sample.entity';
import { SampleRepository } from '../../../database/repositories/sample.repository';
import { AddSampleRequestDto } from './dto/sample.dto';

@Injectable()
export class SampleService {

  constructor(@InjectRepository(Sample) private sampleRepository: SampleRepository) { }

  getAll(): Promise<Sample[]> {
    return this.sampleRepository.find({ select: ["id", "email", "createdAt"] });
  }

  async create(sample: AddSampleRequestDto): Promise<InsertResult> {

    return this.sampleRepository.insert(sample);
  }

  async findOne(email: string): Promise<Sample | undefined> {
    return this.sampleRepository.findOne({ where: { email } })
  }

  async update(id: number, sample: AddSampleRequestDto): Promise<UpdateResult> {
    return this.sampleRepository.update(id, sample);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.sampleRepository.delete(id);
  }
}
