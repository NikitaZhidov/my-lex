import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { createClient } from 'redis';

import { AppModule } from './app/app.module';
import { LoggerMiddleware } from './libs/common/middlewares/logger.middleware';

const APP_GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(new LoggerMiddleware().use);

  app.enableCors({
    origin: configService.getOrThrow('WEB_APP_BASE_URL'),
    credentials: true,
  });

  const redisClient = createClient({
    url: configService.getOrThrow<string>('REDIS_URL'),
  });
  await redisClient.connect().catch(console.error);

  app.setGlobalPrefix(APP_GLOBAL_PREFIX);

  app.use(cookieParser(configService.getOrThrow<string>('COOKIE_SECRET')));
  app.use(
    expressSession({
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      name: configService.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: configService.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: Number(configService.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: JSON.parse(
          configService.getOrThrow<string>('SESSION_HTTP_ONLY'),
        ),
        secure: JSON.parse(configService.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      proxy: JSON.parse(configService.getOrThrow<string>('SESSION_SECURE')),
      store: new RedisStore({
        client: redisClient,
        prefix: configService.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  const port = configService.getOrThrow<string>('API_PORT') || 3001;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${APP_GLOBAL_PREFIX}`,
  );
}

bootstrap();
