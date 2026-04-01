import {
  buildUsernameFromName,
  toOptionalLocalDate,
  toOptionalLocalDateTime,
  toOptionalNumber,
} from './payload.utils';

describe('payload.utils', () => {
  it('builds a normalized username with underscores', () => {
    expect(buildUsernameFromName('Sami', 'Ben Salah')).toBe('sami_ben_salah');
    expect(buildUsernameFromName('Élise', 'Aït-Hamou')).toBe('elise_ait_hamou');
  });

  it('converts optional numeric values safely', () => {
    expect(toOptionalNumber('42')).toBe(42);
    expect(toOptionalNumber('')).toBeUndefined();
    expect(toOptionalNumber('abc')).toBeUndefined();
  });

  it('normalizes local date and datetime payloads', () => {
    expect(toOptionalLocalDate('2026-03-30T12:45')).toBe('2026-03-30');
    expect(toOptionalLocalDateTime('2026-03-30T12:45:30')).toBe('2026-03-30T12:45');
  });
});
