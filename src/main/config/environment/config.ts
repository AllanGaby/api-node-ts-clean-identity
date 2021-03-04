import { SMTPConfig } from '@/infra/comunication'
import { RepositoryTypes } from '@/infra/db'
import { RedisOptions } from 'ioredis'
import { CacheTypes } from '@/infra/cache'
import dotenv from 'dotenv'
import path from 'path'

export enum Environment {
  test = 'Test',
  production = 'Production'
}

export interface User {
  name: string
  email: string
  password: string
}

export interface Env {
  port: string | number
  baseDir: string
  environment: Environment
  repositoryType: RepositoryTypes
  cacheType: CacheTypes
  urlRabbitMQ: string
  jwtSecret: string
  tokenName: string
  uploadAvatarDir: string
  default: User
  smtpConfig: SMTPConfig
  redisConfig: RedisOptions
}

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '..', '.env')
})

export const EnvConfig: Env = ({
  port: process.env.PORT,
  urlRabbitMQ: process.env.URL_RABBITMQ,
  baseDir: process.env.BASEDIR,
  environment: process.env.ENVIRONMENT as Environment,
  repositoryType: process.env.REPOSITORY_TYPE as RepositoryTypes,
  cacheType: process.env.CACHE_TYPE as CacheTypes,
  jwtSecret: process.env.JWT_SECRET,
  tokenName: process.env.AUTH_TOKEN_NAME,
  uploadAvatarDir: process.env.UPLOAD_AVATAR_DIR,
  default: {
    name: process.env.DEFAULT_USER_NAME,
    email: process.env.DEFAULT_USER_EMAIL,
    password: process.env.DEFAULT_USER_PASSWORD
  },
  smtpConfig: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Boolean(process.env.SMTP_SECURE),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  redisConfig: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
  }
})
