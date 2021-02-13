export const avatarAccountRequestSchema = {
  type: 'object',
  properties: {
    avatar_file_path: {
      type: 'string',
      format: 'binary',
      description: 'Avatar file'
    }
  }
}
