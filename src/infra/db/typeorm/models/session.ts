import { SessionModel, SessionType } from './../../../../domain/models/auth'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('sessions')
export class Session implements SessionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  account_id: string

  @Column('smallint')
  type: SessionType

  @Column('timestamp')
  deleted_at?: Date

  @Column('timestamp')
  experied_at: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
