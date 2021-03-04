export const serverError = {
  description: 'Ocorreu um erro inesperado no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

export const serverErrorRef = '#/components/serverError'
