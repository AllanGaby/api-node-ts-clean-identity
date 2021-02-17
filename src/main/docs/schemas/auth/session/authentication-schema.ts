export const authenticationRequestSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'Endereço de e-mail usado no cadastro do usuário'
    },
    password: {
      type: 'string',
      description: 'Senha de acesso'
    }
  },
  required: [
    'email', 'password'
  ]
}

export const authenticationResponseSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      description: 'Token de autenticação para as rotas autenticadas'
    },
    account: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Identificador único da conta do usuário'
        },
        name: {
          type: 'string',
          description: 'Nome do usuário'
        },
        avatar_file_id: {
          type: 'string',
          format: 'uuid',
          description: 'Identificador único do avatar do usuário'
        }
      }
    }
  }
}
