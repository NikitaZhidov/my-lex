import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { type Request } from 'express';

@Injectable()
export class TermGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const term = request.query['term']?.toString()?.trim();

    if (!term) {
      throw new BadRequestException('terms.noTermWasProvided');
    }

    return true;
  }
}
