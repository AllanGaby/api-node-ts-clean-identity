import { createConnection, getConnectionOptions, Connection } from 'typeorm'

export const createTypeOrmConnection = async (host: string, name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()

  return await createConnection(
    Object.assign(defaultOptions, {
      host,
      name
    })
  )
}
