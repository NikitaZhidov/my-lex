import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';

export const getRecaptchaConfig = async (
  configService: ConfigService,
): Promise<GoogleRecaptchaModuleOptions> => {
  const recaptchaSecretKey = configService.get<string>(
    'GOOGLE_RECAPTCHA_SECRET_KEY',
  );
  const hasKey = recaptchaSecretKey && recaptchaSecretKey.length > 0;

  return {
    secretKey: recaptchaSecretKey || 'disabled',
    response: req => req.headers.recaptcha,
    skipIf: !hasKey,
  };
};
