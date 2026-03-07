export const recaptchaEnabled = () => {
  const siteKey = getRecaptchaSiteKey();

  return siteKey && siteKey.length > 0;
};

export const getRecaptchaSiteKey = () => {
  return process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? '';
};
