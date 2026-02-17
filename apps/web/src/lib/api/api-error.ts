import { BackendError } from './fetch-client';

export class ApiError extends Error {
  readonly title: BackendError['message'];
  readonly errors?: BackendError['errors'];

  constructor(
    readonly statusCode: number,
    backendError?: BackendError,
  ) {
    super(backendError?.message ?? 'exceptions.somethingWentWrong');

    this.title = backendError?.message ?? '';
    this.errors = backendError?.errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
