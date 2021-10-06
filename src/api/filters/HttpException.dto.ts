import { ApiProperty } from "@nestjs/swagger";

export class HttpExceptionDto {

  @ApiProperty({ description: 'Status Code', example: 500 })
  statusCode: number;
  @ApiProperty({ description: 'Timestamp', example: new Date().toISOString() })
  timestamp: string;
  @ApiProperty({ description: 'Requested Path', example: '/health' })
  path: string;



}