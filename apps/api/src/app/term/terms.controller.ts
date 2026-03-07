import {
  Controller,
  MessageEvent,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { type SupportedLanguage } from '@my-lex/locales';
import { type TermSettings } from '@my-lex/shared-models';

import { UserLocale } from '../../libs/common/decorators/user-locale.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserEntity } from '../users/domain-entities/user-entity';

import { TermSettingsValue } from './decorators';
import { TermGuard } from './guards/term.guard';
import { TermsService } from './terms.service';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @UseGuards(AuthGuard, TermGuard)
  @Sse('definition/stream')
  getDefinitionStream(
    @Authorized('id') userId: UserEntity['id'],
    @Query('term') term: string,
    @TermSettingsValue() termSettings: TermSettings,
    @UserLocale() locale: SupportedLanguage,
  ): Observable<MessageEvent> {
    return this.termsService
      .getTermStreamDefinition(userId, term, locale, termSettings)
      .pipe(map(chunk => ({ data: chunk })));
  }
}
