export const sessionModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Session identification'
    },
    account_id: {
      type: 'string',
      format: 'uuid',
      description: 'Account identification'
    },
    type: {
      type: 'integer',
      description: 'Session type (1 - Active account, 2 - Authentication, 3 - Recover password)',
      enum: [1, 2]
    },
    experied_at: {
      type: 'string',
      format: 'date'
    },
    created_at: {
      type: 'string',
      format: 'date'
    },
    updated_at: {
      type: 'string',
      format: 'date'
    }
  }
}
