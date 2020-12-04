import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptFileRoute = (controller: Controller<any, any>, fileField: string = 'file') => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest<any> = {
      body: request.body,
      params: request.params,
      headers: request.headers
    }
    if (request.file) {
      httpRequest.body[fileField] = request.file.filename
    }

    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.sendFile(httpResponse.body[fileField])
      return response
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
