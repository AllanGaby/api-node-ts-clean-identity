export const setAccountTypeSchema = {
  type: 'object',
  properties: {
    account_id: {
      type: 'string',
      format: 'uuid',
      description: 'Account id to update'
    },
    account_type: {
      type: 'integer',
      description: 'Account type (1 - Manager, 2 - Student)',
      enum: [1, 2]
    }
  },
  required: [
    'account_id', 'account_type'
  ]
}
