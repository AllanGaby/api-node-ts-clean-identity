import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class createSession1608649631085 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    const tymestampType = 'timestamp with time zone'

    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'account_id',
            type: 'uuid'
          },
          {
            name: 'type',
            type: 'smallint'
          },
          {
            name: 'deleted_at',
            isNullable: true,
            type: tymestampType
          },
          {
            name: 'experied_at',
            type: tymestampType
          },
          {
            name: 'created_at',
            type: tymestampType,
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: tymestampType,
            default: 'now()'
          }
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'session_account',
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts'
          })
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sessions', 'session_account')
    await queryRunner.dropTable('sessions')
  }
}
