import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';

@ApiTags('sales')
@Controller('sales')
export class SalesController {

  constructor(private readonly salesService: SalesService) { }

  @Get()
  @ApiOperation({ summary: 'Get weekly sales report' })
  @ApiResponse({ status: 200 })
  async getReport(): Promise<any> {
    return '';

  }
}
