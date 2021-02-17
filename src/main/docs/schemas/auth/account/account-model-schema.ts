export const accountModelSchema = {
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
    email: {
      type: 'string',
      format: 'email',
      description: 'Endereço de e-mail do usuário'
    },
    password: {
      type: 'string',
      format: 'password',
      description: 'Senha de acesso'
    },
    email_valided: {
      type: 'boolean',
      description: 'Endereço de e-mail validado?'
    },
    avatar_file_id: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador único do avatar do usuário'
    },
    created_at: {
      type: 'string',
      format: 'date',
      description: 'Data de criação da conta do usuário'
    },
    updated_at: {
      type: 'string',
      format: 'date',
      description: 'Data da última atualização da conta do usuário'
    }
  }
}
