export interface HttpRequest<T> {
  body?: T
  headers?: any
}

export interface HttpResponse<T> {
  statusCode: number
  body: T
}
