import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheAdapter } from './cache/cache.adapter';
import { CacheService } from './cache/cache.service';
import { SqsConsumerService } from './sqs/consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    SqsConsumerService,
    CacheService,
    CacheAdapter,
  ],
})
export class ServicesModule { }
