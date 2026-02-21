import { ApiError } from './api-error';

export interface FetchClientOptions {
  baseUrl: string;
  optionsGetter?: () => Promise<RequestInit>;
}

export type FetchSearchParams = Record<
  string,
  | string
  | number
  | boolean
  | undefined
  | Array<string | boolean | number | undefined>
>;

export interface FetchRequestOptions extends RequestInit {
  params?: FetchSearchParams;
}

type FetchMethodRequestOptions = Omit<FetchRequestOptions, 'body' | 'method'>;

export interface BackendErrorIssue {
  message: string;
  params: Record<string, string | number>;
}

export interface BackendError {
  message: string;
  errors?: BackendErrorIssue[];
}

type FetchBody = Record<string, unknown>;

export class FetchClient {
  private options: FetchClientOptions;

  private get BASE_URL() {
    return this.options.baseUrl;
  }

  constructor(options: FetchClientOptions) {
    this.options = options;
  }

  get<T>(endpoint: string, options?: FetchMethodRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T, TBody extends FetchBody = FetchBody>(
    endpoint: string,
    body?: TBody,
    options?: FetchMethodRequestOptions,
  ) {
    return this.modifyMethod<T, TBody>('POST', endpoint, body, options);
  }

  put<T, TBody extends FetchBody = FetchBody>(
    endpoint: string,
    body: TBody,
    options?: FetchMethodRequestOptions,
  ) {
    return this.modifyMethod<T, TBody>('PUT', endpoint, body, options);
  }

  patch<T, TBody extends FetchBody = FetchBody>(
    endpoint: string,
    body: TBody,
    options?: FetchMethodRequestOptions,
  ) {
    return this.modifyMethod<T, TBody>('PATCH', endpoint, body, options);
  }

  delete<T = void>(endpoint: string, options?: FetchMethodRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  private modifyMethod<T, TBody extends FetchBody = FetchBody>(
    method: string,
    endpoint: string,
    body?: TBody,
    options?: FetchMethodRequestOptions,
  ) {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private async request<T>(endpoint: string, options?: FetchRequestOptions) {
    let url = `${this.BASE_URL}/${endpoint[0] === '/' ? endpoint.slice(1) : endpoint}`;

    if (options?.params) {
      url += `?${this.searchParamsToString(options.params)}`;
    }

    const baseOptions = await this.options.optionsGetter?.();

    const config: RequestInit = {
      ...baseOptions,
      ...(options ?? {}),
      headers: {
        ...(baseOptions?.headers ?? {}),
        ...(options?.headers ?? {}),
      },
    };

    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const cookieHeader = (await cookies()).toString();
      if (cookieHeader) {
        (config.headers as Record<string, string>)['Cookie'] = cookieHeader;
      }
    }

    const res = await fetch(url, config);

    if (!res.ok) {
      const err = (await res.json()) as BackendError | undefined;

      throw new ApiError(res.status, err);
    }

    const isJSON = res.headers
      .get('Content-Type')
      ?.includes('application/json');

    if (isJSON) {
      return (await res.json()) as T;
    }

    return (await res.text()) as T;
  }

  private searchParamsToString(params: FetchSearchParams) {
    if (!params) {
      return '';
    }

    const urlSearchParams = new URLSearchParams();

    for (const key in params) {
      const val = params[key];

      if (Array.isArray(val)) {
        val.forEach(v => v && urlSearchParams.append(key, v.toString()));
      } else {
        if (val) {
          urlSearchParams.append(key, val.toString());
        }
      }
    }

    return urlSearchParams.toString();
  }
}
