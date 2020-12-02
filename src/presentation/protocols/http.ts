export interface HttpRequest<T> {
  body?: T
  params?: any
  headers?: any
  fileName?: string
}

export interface HttpResponse<T> {
  statusCode: number
  body: T
}
