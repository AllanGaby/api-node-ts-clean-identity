import { Middleware, HttpRequest } from '@/presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const adaptAuthenticationMiddleware = (authentication: Middleware<any, any>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest<any> = {
      headers: request.headers
    }
    if (request.file) {
      httpRequest.fileName = request.file.filename
    }

    const httpResponse = await authentication.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      request.body.session = httpResponse.body
      next()
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
