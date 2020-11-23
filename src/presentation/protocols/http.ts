export interface HttpRequest<T> {
  body?: T
  params?: any
  headers?: any
}

export interface HttpResponse<T> {
  statusCode: number
  body: T
}
