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
  FieldGroup,
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

      <CardContent className='space-y-4'>
        <form id='register-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='name'>{t('common.name')}</FieldLabel>

                    <Input
                      {...field}
                      id='name'
                      data-invalid={fieldState.invalid}
                      disabled={isRegisterLoading}
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='email'>{t('auth.email')}</FieldLabel>

                    <Input
                      {...field}
                      id='email'
                      data-invalid={fieldState.invalid}
                      disabled={isRegisterLoading}
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='password'>
                      {t('auth.password')}
                    </FieldLabel>

                    <Input
                      {...field}
                      id='password'
                      data-invalid={fieldState.invalid}
                      disabled={isRegisterLoading}
                      autoComplete='off'
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='repeat-password'>
                      {t('auth.repeatPassword')}
                    </FieldLabel>

                    <Input
                      {...field}
                      id='repeat-password'
                      data-invalid={fieldState.invalid}
                      disabled={isRegisterLoading}
                      autoComplete='off'
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

        <ErrorAlerts parsedError={parsedError} />
      </CardContent>

      <CardFooter className='flex flex-col gap-2'>
        <Button
          disabled={isRegisterLoading}
          form='register-form'
          type='submit'
          className='w-full'
        >
          {t('auth.signUp')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
