import { ApiProperty } from "@nestjs/swagger";
import { Sample } from "../../../../database/entities/sample.entity";

export class AddSampleRequestDto {

  @ApiProperty({ description: 'Email', example: 'aaa@bbb.com' })
  email: string;

}

export class AddSampleResponseDto {
  @ApiProperty({ description: 'Inserted Id ', example: 123456 })
  id: number;
}

export class GetAllSamplesResponseDto {
  @ApiProperty({ description: 'Samples', example: [] })
  samples: Sample[];
}

export class GetSampleResponseDto implements Sample {
  @ApiProperty({ description: 'Id', example: 123456 })
  id: number;
  @ApiProperty({ description: 'Email', example: 'aaa@bbb.com' })
  email: string;
  @ApiProperty({ description: 'Created At', example: new Date() })
  createdAt: Date;

}
