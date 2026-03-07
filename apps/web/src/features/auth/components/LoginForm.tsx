'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Controller, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';

import { LoginUser, LoginUserSchema } from '@my-lex/shared-models';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from '@my-lex/ui';

import {
  useLoginMutation,
  useLoginWithProvider,
} from '../hooks/useLoginMutation';

import { APP_ROUTES } from '@/constants';
import { recaptchaEnabled } from '@/features/recaptcha';
import ErrorAlerts from '@/shared/ui/ErrorAlerts';
import FormFieldError from '@/shared/ui/FormFieldError';

export interface LoginFormProps {
  className?: string;
}

const LoginForm = ({ className }: LoginFormProps) => {
  const t = useTranslations();

  const [recaptcha, setRecaptcha] = useState('');

  const { login, isLoginLoading, parsedError } = useLoginMutation();
  const { login: loginWithProvider, isLoading: isLoginWithProviderLoading } =
    useLoginWithProvider();

  const form = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (loginInfo: LoginUser) => {
    login({ ...loginInfo, recaptcha });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('auth.login')}</CardTitle>

        <CardDescription>{t('auth.loginDescription')}</CardDescription>

        <CardAction>
          <Link href={APP_ROUTES.REGISTER}>
            <Button variant='link'>{t('auth.signUp')}</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <form id='login-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name='email'
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='login-email'>
                      {t('auth.email')}
                    </FieldLabel>

                    <Input
                      {...field}
                      id='login-email'
                      data-invalid={fieldState.invalid}
                      disabled={isLoginLoading}
                      autoComplete='home email'
                      type='email'
                      placeholder='alex@exampe.com'
                    />

                    <FormFieldError fieldState={fieldState} />
                  </Field>
                );
              }}
            />

            <Controller
              control={form.control}
              name='password'
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='login-password'>
                      {t('auth.password')}
                    </FieldLabel>

                    <Input
                      {...field}
                      id='login-password'
                      data-invalid={fieldState.invalid}
                      disabled={isLoginLoading}
                      autoComplete='current-password'
                      type='password'
                      placeholder='******'
                    />

                    <FormFieldError fieldState={fieldState} />
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <ErrorAlerts className='max-w-100' parsedError={parsedError} />
      </CardContent>

      <CardFooter className='flex flex-col gap-2'>
        {recaptchaEnabled() && <GoogleReCaptcha onVerify={setRecaptcha} />}

        <Button
          disabled={isLoginLoading}
          type='submit'
          form='login-form'
          className='w-full'
        >
          {t('auth.login')}
        </Button>

        <Button
          onClick={() => loginWithProvider('google')}
          disabled={isLoginLoading || isLoginWithProviderLoading}
          type='button'
          variant='outline'
          className='w-full'
        >
          <FaGoogle />
          {t('auth.loginWithGoogle')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
