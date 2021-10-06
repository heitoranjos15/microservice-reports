import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleRepository } from '../../../database/repositories/sample.repository';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

@Module({
  imports: [TypeOrmModule.forFeature([SampleRepository])],
  controllers:[SampleController],
  providers: [SampleService],
  exports: [SampleService],
})
export class SampleModule {}
