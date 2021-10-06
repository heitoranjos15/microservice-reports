import { Injectable } from '@nestjs/common';
import * as cache from '@queimadiaria/backend-cache-lib';

@Injectable()
export class CacheAdapter {
    async getKey(key: string): Promise<any> {
        return cache.getKey(key);
    }

    async setKey(key: string, value: any): Promise<any> {
        return cache.setKey(key, value, 60);
      }

    async delKey(key: string): Promise<any> {
       return cache.delKey(key);
    }
}
