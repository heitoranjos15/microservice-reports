import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './entities/sample.entity';


@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: [Sample], // Put entities here 
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'dist/migrations',
    },
    synchronize: false,
  }),
  ],
})
export class DatabaseModule { }
