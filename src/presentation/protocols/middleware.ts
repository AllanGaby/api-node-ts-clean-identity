import { HttpRequest, HttpResponse } from './'

export interface Middleware<RequestBody, ResponseBody> {
  handle: (request: HttpRequest<RequestBody>) => Promise<HttpResponse<ResponseBody>>
}
