export interface TokenPayload {
    sub: string;
  preferred_username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  exp: number;
  iat: number;
}
