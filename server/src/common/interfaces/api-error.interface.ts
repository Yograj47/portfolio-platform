export interface ApiError {
    success: boolean;
    statuscode: number;
    message: string | string[];
    path: string;
    timestamp: string;
}