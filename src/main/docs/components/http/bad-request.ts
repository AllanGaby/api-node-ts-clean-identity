export const badRequest = {
  description: 'Requisição inválida - Maiores detalhes na mensagem de erro',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

export const badRequestRef = '#/components/badRequest'
