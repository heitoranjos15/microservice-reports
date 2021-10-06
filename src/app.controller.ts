import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/running')
  getAppEndpoint(): string {
    const date = new Date().toISOString();
    const { ENV } = process.env;

    return `RUNNING ${process.env.NODE_ENV}`;
  }
}
