import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "D'OH 프로젝트 시작!";
  }
}
