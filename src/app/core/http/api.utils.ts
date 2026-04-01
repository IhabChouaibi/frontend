import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../enviroment/enviroment';
import { ApiErrorPayload } from '../../models/shared/api-error-payload';
import { PagedResponse } from '../../models/shared/paged-response';

export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryParamValue>;

export function buildHttpParams(values: QueryParams = {}): HttpParams {
  let params = new HttpParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  });

  return params;
}

export function buildPageParams(page: number, size: number, extra: QueryParams = {}): HttpParams {
  return buildHttpParams({
    page,
    size,
    ...extra,
  });
}

export function normalizePagedResponse<TInput, TOutput>(
  page: PagedResponse<TInput> | null | undefined,
  mapper: (item: TInput) => TOutput
): PagedResponse<TOutput> {
  return {
    content: (page?.content ?? []).map((item) => mapper(item)),
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
    size: page?.size ?? 0,
    number: page?.number ?? 0,
    first: page?.first ?? true,
    last: page?.last ?? true,
    numberOfElements: page?.numberOfElements ?? 0,
  };
}

export function extractApiErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  const payload = error.error as ApiErrorPayload | null | undefined;
  const validationErrors = payload?.errors;

  if (validationErrors) {
    const firstValidationMessage = Object.values(validationErrors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .find((value) => typeof value === 'string' && value.trim());

    if (firstValidationMessage) {
      return firstValidationMessage;
    }
  }

  return payload?.message ?? payload?.error ?? error.message ?? 'An unexpected error occurred.';
}

export function createApiErrorHandler(operation: string) {
  return (error: HttpErrorResponse): Observable<never> => {
    return throwError(
      () => new Error(extractApiErrorMessage(error) || `Unable to ${operation}. Please try again.`)
    );
  };
}

export function debugApiRequest(
  method: 'POST' | 'PUT' | 'PATCH',
  url: string,
  payload?: unknown,
  params?: HttpParams
): void {
  if (environment.production) {
    return;
  }

  const paramSnapshot = params
    ? params.keys().reduce<Record<string, string | string[]>>((acc, key) => {
        const values = params.getAll(key) ?? [];
        acc[key] = values.length > 1 ? values : (values[0] ?? '');
        return acc;
      }, {})
    : undefined;

  console.debug('[API Request]', {
    method,
    url,
    params: paramSnapshot,
    payload,
  });
}
