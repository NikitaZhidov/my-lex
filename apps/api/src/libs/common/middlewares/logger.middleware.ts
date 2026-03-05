import { Injectable, NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // TODO: remove later
    console.log(`REQUEST: ${req.url}`);
    next();
  }
}