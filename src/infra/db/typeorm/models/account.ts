import { AccountModel, AccountType } from './../../../../domain/models/auth'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('account')
export class Account implements AccountModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  email_valided: boolean

  @Column('smallint')
  type: AccountType

  @Column()
  avatar_extention?: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
