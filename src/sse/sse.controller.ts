import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { SseService } from './sse.service';
import { sendMessage } from './type/sendMessage';
import { Controller, Sse, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';

@ApiTags('SSE')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('event')
  sendEvent(): Observable<sendMessage> {
    return;
  }
}
