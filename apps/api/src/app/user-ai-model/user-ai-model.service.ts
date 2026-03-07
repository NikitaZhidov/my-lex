import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

import { APP_DEFAULT_AI_MODEL } from '../ai-model/factories/ai-model-provider.factory';
import { MockAIModelProvider } from '../ai-model/providers/mock-ai-model.provider';
import { type AIModelProvider } from '../ai-model/types/ai-model-provider';
import { UserEntity } from '../users/domain-entities/user-entity';

const DEFAULT_LIMIT = 100;
const DEFAULT_REFRESH_PERIOD = 60 * 60;

@Injectable()
export class UserAIModelService implements OnModuleInit, OnModuleDestroy {
  private redisStorageClient = createClient({
    url: this.configService.getOrThrow<string>('REDIS_URL'),
  });

  private readonly requestsLimit = Number(
    this.configService.get<string>('USER_AI_REQUESTS_LIMIT_PER_PERIOD') ||
      DEFAULT_LIMIT,
  );
  private readonly refreshPeriod = Number(
    this.configService.get<string>(
      'USER_AI_REQUESTS_REFRESH_PERIOD_IN_SECONDS',
    ) || DEFAULT_REFRESH_PERIOD,
  );

  private readonly limiter = new RateLimiterRedis({
    storeClient: this.redisStorageClient,
    useRedisPackage: true,
    keyPrefix: 'user-ai-requests-limit',
    duration: this.refreshPeriod,
    points: this.requestsLimit,
  });

  constructor(
    @Inject(APP_DEFAULT_AI_MODEL)
    private readonly defaultAppAIModel: AIModelProvider,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.redisStorageClient
      .connect()
      .then(() =>
        this.logger.log(
          `Enabled AI requests limits. Limit per user: ${this.requestsLimit}. Refresh period: ${this.refreshPeriod / 60} minutes`,
        ),
      )
      .catch(console.error);
  }

  onModuleDestroy() {
    this.redisStorageClient.destroy();
  }

  async responseText(
    userId: UserEntity['id'],
    prompt: string,
  ): Promise<string> {
    const model = await this.consumePointAndGetUserAIModel(userId);
    return model.responseText(prompt);
  }

  async responseTextStream(
    userId: UserEntity['id'],
    prompt: string,
    abortSignal?: AbortSignal,
  ): Promise<AsyncIterable<string>> {
    const model = await this.consumePointAndGetUserAIModel(userId);
    return model.responseTextStream(prompt, abortSignal);
  }

  private async consumePointAndGetUserAIModel(userId: UserEntity['id']) {
    const res = await this.limiter.get(userId);

    if (!res || res.remainingPoints > 0) {
      await this.limiter.consume(userId).catch(console.error);
      return this.defaultAppAIModel;
    }

    return new MockAIModelProvider(
      `You are out of requests. Your limits will refresh in **${this.msToHumanReadableDuration(res.msBeforeNext ?? 0)}**`,
    );
  }

  private msToHumanReadableDuration(ms: number) {
    if (ms < 0) ms = 0;

    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} h ${minutes} min`;
  }
}
