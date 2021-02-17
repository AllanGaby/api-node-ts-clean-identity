export const updateAccountRequestSchema = {
  type: 'object',
  properties: {
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
      description: 'Senha de acesso atual do usuário'
    },
    new_password: {
      type: 'string',
      format: 'password',
      description: 'Nova senha de acesso'
    },
    password_confirmation: {
      type: 'string',
      format: 'password',
      description: 'Confirmação da senha de acesso'
    }
  }
}
