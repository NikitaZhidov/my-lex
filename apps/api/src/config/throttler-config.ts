import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const appThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  const isE2E = configService.get<string>('E2E') === 'true';

  return {
    throttlers: isE2E
      ? []
      : [
          {
            ttl: 10000,
            limit: 10,
          },
        ],
  };
};
