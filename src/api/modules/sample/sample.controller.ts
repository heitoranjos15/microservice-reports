import { BadRequestException, Body, ConflictException, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionDto } from '../../filters/HttpException.dto';
import { AddSampleRequestDto, AddSampleResponseDto, GetAllSamplesResponseDto, GetSampleResponseDto } from './dto/sample.dto';
import { SampleService } from './sample.service';

@ApiTags('sample')
@Controller('sample')
export class SampleController {

  constructor(private readonly sampleService: SampleService) { }

  @Get()
  @ApiOperation({ summary: 'Get Samples' })
  @ApiResponse({ status: 200, type: GetAllSamplesResponseDto })
  async getAll(): Promise<GetAllSamplesResponseDto> {

    const samples = await this.sampleService.getAll();

    return { samples }

  }

  @Get(':email')
  @ApiOperation({ summary: 'Get a Sample by email' })
  @ApiParam({ name: 'email', description: 'E-mail' })
  @ApiResponse({ status: 200, type: GetSampleResponseDto })
  @ApiResponse({ status: 404, type: HttpExceptionDto })
  async getSample(@Param() params): Promise<GetSampleResponseDto> {
    const sample = await this.sampleService.findOne(params.email);
    if (sample) {

      return sample;
    }
    throw new NotFoundException('Sample not found');

  }

  @Post()
  @ApiOperation({ summary: 'Add a new sample' })
  @ApiBody({ required: true, type: AddSampleRequestDto })
  @ApiResponse({ status: 200, type: AddSampleResponseDto })
  @ApiResponse({ status: 400, type: HttpExceptionDto })
  @ApiResponse({ status: 401, type: HttpExceptionDto })
  @ApiResponse({ status: 409, type: HttpExceptionDto })
  async addSample(@Body() createSample: AddSampleRequestDto): Promise<AddSampleResponseDto> {

    try {
      const result = await this.sampleService.create(createSample);
      return { id: result.raw[0].id };
    } catch (error) {
      switch (error.code) {
        case '23502':
          throw new BadRequestException(error.message);
        case '23505':
          throw new ConflictException(`${error.message} - ${error.detail}`);
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

  }

}
