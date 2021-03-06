import { HttpRequest, HttpResponse } from './'

export interface Controller<RequestBody, ResponseBody> {
  handle: (request: HttpRequest<RequestBody>) => Promise<HttpResponse<ResponseBody>>
}
