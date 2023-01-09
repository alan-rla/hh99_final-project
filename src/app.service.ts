import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '항해 99 실전 프로젝트 시작!';
  }
}
