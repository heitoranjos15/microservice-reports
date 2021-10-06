import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';

describe('SampleService', () => {
  let filter: HttpExceptionFilter;

  const mockLogger = { error: jest.fn() };

  const mockContext: any = {
    switchToHttp: () => ({
      getRequest: () => ({
        url: 'http://localhost/mock',
      }),
      getResponse: () => {
        const response = {
          code: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
          status: () => {
            return {
              json: (obj: unknown) => obj,
            }
          },
        };
        return response;
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch an exception', () => {
    const exception = new HttpException(mockLogger, 500);
    console.log = () => null;
    console.error = () => null;

    expect(filter.catch(exception, mockContext)).toBeFalsy();
  });


});
