export interface ApiError {
  success: boolean;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}
