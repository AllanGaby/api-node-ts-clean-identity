import { createConnection, getConnectionOptions, Connection } from 'typeorm'

export class CreateTypeOrmConnection {
  private static connection: Connection

  public static async getConnection (name: string = 'default'): Promise<Connection> {
    if (!CreateTypeOrmConnection.connection) {
      const defaultOptions = await getConnectionOptions()
      CreateTypeOrmConnection.connection = await createConnection(
        Object.assign(defaultOptions, {
          name,
          database:
            process.env.NODE_ENV === 'test'
              ? 'identity_tests'
              : defaultOptions.database
        })
      )
    }
    if (!this.connection.isConnected) {
      await this.connection.connect()
    }
    return CreateTypeOrmConnection.connection
  }
}
