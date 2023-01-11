import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class LoggerMiddleware implements NestMiddleware {
    private logger;
    use(request: Request, respone: Response, next: NextFunction): void;
}
