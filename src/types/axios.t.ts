export interface RequestOptions {
    timeout?: number,
    headers?: Record<string, string>
}

export interface ApiResponse<T = any, E = any> {
    success: boolean, 
    data?: T,
    error?: E,
    status?: number, 
    headers?: any
}

export interface ApiError<T = any> {
    data: T, 
    message: string
}