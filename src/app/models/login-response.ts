export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  username: string;
  roles: string[];
  employeeId: number | null;
}
