import { Injectable } from '@nestjs/common';
import { CacheAdapter } from './cache.adapter';


@Injectable()
export class CacheService {

  constructor(private cacheAdapter: CacheAdapter) {}

  async get(key: string): Promise<any> {
    return this.cacheAdapter.getKey(key);
  }

  async set(key: string, value: any): Promise<any> {
    return this.cacheAdapter.setKey(key, value);
  }

  async del(key: string): Promise<any> {
    return this.cacheAdapter.delKey(key);
  }
}
