export function toRequiredTrimmedString(value: unknown): string {
  return String(value ?? '').trim();
}

export function toOptionalTrimmedString(value: unknown): string | undefined {
  const normalized = toRequiredTrimmedString(value);
  return normalized ? normalized : undefined;
}

export function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

export function toOptionalLocalDate(value: unknown): string | undefined {
  const normalized = toOptionalTrimmedString(value);
  return normalized ? normalized.slice(0, 10) : undefined;
}

export function toOptionalLocalDateTime(value: unknown): string | undefined {
  const normalized = toOptionalTrimmedString(value);
  return normalized ? normalized.slice(0, 16) : undefined;
}

export function buildUsernameFromName(firstName: string, lastName: string): string {
  const normalizePart = (value: string): string =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

  const normalizedFirstName = normalizePart(firstName);
  const normalizedLastName = normalizePart(lastName);

  return [normalizedFirstName, normalizedLastName].filter(Boolean).join('_');
}
