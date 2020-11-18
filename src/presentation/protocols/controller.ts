import { HttpRequest, HttpResponse } from './'

export interface Controller<T, R> {
  handle: (request: HttpRequest<T>) => Promise<HttpResponse<R>>
}
