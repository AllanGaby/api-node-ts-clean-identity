import { Middleware, HttpRequest } from '@/presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware<any, any>, returnObjectName: string = 'account') => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest<any> = {
      headers: request.headers
    }

    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      request.body[returnObjectName] = httpResponse.body
      next()
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
