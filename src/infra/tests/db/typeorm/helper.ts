import { Connection, getConnection } from 'typeorm'

export const dropTables = async (connection: Connection): Promise<void> => {
  await connection.query('DROP TABLE IF EXISTS sessions')
  await connection.query('DROP TABLE IF EXISTS accounts')
  await connection.query('DROP TABLE IF EXISTS migrations')
}

export const truncateAccounts = async (connection: Connection): Promise<void> => {
  await connection.query('DELETE FROM sessions')
  await connection.query('DELETE FROM accounts')
}

export const truncateTables = async (connection: Connection): Promise<void> => {
  await truncateAccounts(connection)
  await connection.query('DELETE FROM migrations')
}

export const closeConnection = async (connection: Connection): Promise<void> => {
  const mainConnection = getConnection()
  await connection.close()
  await mainConnection.close()
}
