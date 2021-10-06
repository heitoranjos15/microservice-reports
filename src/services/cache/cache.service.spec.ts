import { Test, TestingModule } from '@nestjs/testing';
import * as cache from '@queimadiaria/backend-cache-lib';
import { ServicesModule } from '../services.module';
import { CacheAdapter } from './cache.adapter';
import { CacheService } from './cache.service';

const mockCacheAdapter = () => ({
  getKey: jest.fn().mockReturnValue('test'),
  setKey: jest.fn().mockReturnValue(true),
  delKey: jest.fn().mockReturnValue(1),
});

describe('CacheService', () => {
  let service: CacheService;

  beforeAll(async () => {
    console.log = () => null;
    await cache.cacheClient({
      environment: process.env.NODE_ENV,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServicesModule],
      providers: [CacheService, {provide: CacheAdapter, useFactory: mockCacheAdapter}],

    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  afterAll(async () => {
    console.log = () => null;
    cache.disconnect();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a key and get it\'s value', async () => {
    const key = await service.set('key', 'test');
    expect(key).toBe(true);

    const value = await service.get('key');
    expect(value).toBe('test');
  });

  it('should set a key and then delete it', async () => {
    const key = await service.set('key', 'teste');
    expect(key).toBe(true);

    const deletedKey = await service.del('key');
    expect(deletedKey).toEqual(1);
  });
});
