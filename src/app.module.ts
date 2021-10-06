import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ServicesModule } from './services/services.module';
import { ApiModule } from './api/api.module';
import { WinstonModule } from 'nest-winston';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  WinstonModule.forRoot({}),
    TerminusModule,
    DatabaseModule,
    ServicesModule,
    ApiModule],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule { }
