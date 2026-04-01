export interface ApiErrorPayload {
  status?: number;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}
