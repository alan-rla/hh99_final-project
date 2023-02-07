import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SseService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * redis 데이터 변경 감지 TODO
   */
  async sendEvent() {
    return '데이터 변경 감지';
  }
}
