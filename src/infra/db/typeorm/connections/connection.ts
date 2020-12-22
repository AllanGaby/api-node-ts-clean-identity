import { createConnection, getConnectionOptions, Connection } from 'typeorm'

export const createTypeOrmConnection = async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()

  return await createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'test'
          ? 'identity_tests'
          : defaultOptions.database
    })
  )
}
