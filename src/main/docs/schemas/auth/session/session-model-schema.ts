export const sessionModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador único da sessão de acesso'
    },
    account_id: {
      type: 'string',
      format: 'uuid',
      description: 'Identificador da conta do usuário'
    },
    type: {
      type: 'integer',
      description: 'Tipo da sessão <br/> ' +
                   '<ul>' +
                   '<li>1 - Active account</li>' +
                   '<li>2 - Authentication</li>' +
                   '<li>3 - Recover password</li>' +
                   '</ul>',
      enum: [1, 2, 3]
    },
    deleted_at: {
      type: 'string',
      format: 'date',
      description: 'Data em que a sessão de acesso foi invalidada (Logout)'
    },
    experied_at: {
      type: 'string',
      format: 'date',
      description: 'Data de expiração da sessão de acesso'
    },
    created_at: {
      type: 'string',
      format: 'date',
      description: 'Data de criação da sessão de acesso'
    },
    updated_at: {
      type: 'string',
      format: 'date',
      description: 'Data da última atualização da sessão de acesso'
    }
  }
}
