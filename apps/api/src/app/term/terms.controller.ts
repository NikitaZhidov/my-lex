import {
  Controller,
  MessageEvent,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { AuthGuard } from '../auth/guards/auth.guard';

import { TermGuard } from './guards/term.guard';
import { TermsService } from './terms.service';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @UseGuards(AuthGuard, TermGuard)
  @Sse('definition/stream')
  getDefinitionStream(@Query('term') term: string): Observable<MessageEvent> {
    return this.termsService
      .getTermStreamDefinition(term)
      .pipe(map(chunk => ({ data: chunk })));
  }
}
