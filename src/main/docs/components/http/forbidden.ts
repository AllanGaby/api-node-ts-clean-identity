export const forbidden = {
  description: 'Requisição não permitida - Maiores detalhes na mensagem de erro',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

export const forbiddenRef = '#/components/forbidden'
