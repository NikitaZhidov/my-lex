'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { CreateUser, CreateUserSchema } from '@my-lex/shared-models';
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

import { useRegisterMutation } from '../hooks/userRegisterMutation';

import { APP_ROUTES } from '@/constants';
import ErrorAlerts from '@/shared/ui/ErrorAlerts';
import FormFieldError from '@/shared/ui/FormFieldError';

export interface RegisterFormProps {
  className?: string;
}

const RegisterForm = ({ className }: RegisterFormProps) => {
  const t = useTranslations();

  const { register, isRegisterLoading, parsedError } = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: '',
    },
  });

  const onSubmit = (registerInfo: CreateUser) => {
    register(registerInfo);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('auth.signUp')}</CardTitle>

        <CardDescription>{t('auth.registerDescription')}</CardDescription>

        <CardAction>
          <Link href={APP_ROUTES.LOGIN}>
            <Button variant='link'>{t('auth.login')}</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>{t('common.name')}</FieldLabel>
                  <Input
                    {...field}
                    disabled={isRegisterLoading}
                    name='name'
                    placeholder='Alex'
                  />

                  <FormFieldError fieldState={fieldState} />
                </Field>
              );
            }}
          />

          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>{t('auth.email')}</FieldLabel>
                  <Input
                    {...field}
                    disabled={isRegisterLoading}
                    name='email'
                    type='email'
                    autoComplete='home email'
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
                    disabled={isRegisterLoading}
                    autoComplete='current-password'
                    name='password'
                    type='password'
                    placeholder='******'
                  />

                  <FormFieldError fieldState={fieldState} />
                </Field>
              );
            }}
          />

          <Controller
            control={form.control}
            name='passwordRepeat'
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>{t('auth.repeatPassword')}</FieldLabel>

                  <Input
                    {...field}
                    disabled={isRegisterLoading}
                    name='passwodRepeat'
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
          <Button disabled={isRegisterLoading} type='submit' className='w-full'>
            {t('auth.signUp')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
