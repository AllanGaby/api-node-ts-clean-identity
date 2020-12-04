import { HttpResponse } from '@/presentation/protocols'

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data
})

export const created = <T>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse<any> => ({
  statusCode: 204,
  body: undefined
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  body: error,
  statusCode: 400
})

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  body: error,
  statusCode: 401
})

export const forbidden = (error: Error): HttpResponse<Error> => ({
  statusCode: 403,
  body: error
})

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: error
})
