export const requestRecoverPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'Endereço de e-mail do usuário'
    }
  },
  required: [
    'email'
  ]
}

export const recoverPasswordSchema = {
  type: 'object',
  properties: {
    session_id: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador único da sessão de acesso para a recuperação da senha'
    },
    password: {
      type: 'string',
      format: 'password',
      description: 'Nova senha de acesso'
    },
    password_confirmation: {
      type: 'string',
      format: 'password',
      description: 'Confirmação da senha de acesso'
    }
  },
  required: [
    'session_id', 'password', 'password_confirmation'
  ]
}
