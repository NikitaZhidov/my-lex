'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
  FieldLabel,
  Input,
} from '@my-lex/ui';

import { useLoginMutation } from '../hooks/useLoginMutation';

import { APP_ROUTES } from '@/constants';
import ErrorAlerts from '@/shared/ui/ErrorAlerts';
import FormFieldError from '@/shared/ui/FormFieldError';

export interface LoginFormProps {
  className?: string;
}

const LoginForm = ({ className }: LoginFormProps) => {
  const t = useTranslations();

  const { login, isLoginLoading, parsedError } = useLoginMutation();

  const form = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (loginInfo: LoginUser) => {
    login(loginInfo);
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

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>{t('auth.email')}</FieldLabel>
                  <Input
                    {...field}
                    disabled={isLoginLoading}
                    name='email'
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
                <Field>
                  <FieldLabel>{t('auth.password')}</FieldLabel>

                  <Input
                    {...field}
                    disabled={isLoginLoading}
                    name='passwod'
                    type='password'
                    placeholder='******'
                  />

                  <FormFieldError fieldState={fieldState} />
                </Field>
              );
            }}
          />

          <ErrorAlerts parsedError={parsedError} />
        </CardContent>

        <CardFooter className='flex flex-col gap-2 mt-6'>
          <Button disabled={isLoginLoading} type='submit' className='w-full'>
            {t('auth.login')}
          </Button>

          <Button
            disabled={isLoginLoading}
            type='button'
            variant='outline'
            className='w-full'
          >
            <FaGoogle />
            {t('auth.loginWithGoogle')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
