import { HttpErrorResponse } from '@angular/common/http';

import { buildPageParams, extractApiErrorMessage, normalizePagedResponse } from './api.utils';

describe('api.utils', () => {
  it('extracts the first validation error message when backend returns field errors', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        message: 'Validation failed',
        errors: {
          username: 'username is required',
          email: 'email must be valid',
        },
      },
    });

    expect(extractApiErrorMessage(error)).toBe('username is required');
  });

  it('builds page params with extra query values', () => {
    const params = buildPageParams(2, 25, { keyword: 'john' });

    expect(params.get('page')).toBe('2');
    expect(params.get('size')).toBe('25');
    expect(params.get('keyword')).toBe('john');
  });

  it('normalizes an empty paged response safely', () => {
    const page = normalizePagedResponse<{ value: number }, number>(undefined, (item) => item.value);

    expect(page.content).toEqual([]);
    expect(page.totalElements).toBe(0);
    expect(page.first).toBeTrue();
  });
});
