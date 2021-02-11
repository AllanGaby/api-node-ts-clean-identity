import { SMTPConfig } from '@/infra/comunication'
import { RepositoryTypes } from '@/infra/db'
import { RedisOptions } from 'ioredis'
import { CacheTypes } from '@/infra/cache'

export interface User {
  name: string
  email: string
  password: string
}

export interface Env {
  port: string | number
  baseDir: string
  repositoryType: RepositoryTypes
  cacheType: CacheTypes
  urlRabbitMQ: string
  jwtSecret: string
  tokenName: string
  default: User
  smtpConfig: SMTPConfig
  redisConfig: RedisOptions
}

export const EnvConfig: Env = ({
  port: process.env.PORT || 3333,
  urlRabbitMQ: process.env.URL_RABBITMQ || 'amqp://identity:masterkey@localhost:5672',
  baseDir: process.env.BASEDIR || 'src',
  repositoryType: process.env.REPOSITORY_TYPE as RepositoryTypes || RepositoryTypes.TypeOrm,
  cacheType: process.env.CACHE_TYPE as CacheTypes || CacheTypes.Redis,
  jwtSecret: process.env.JWT_SECRET || '01c383ef-b869-43f6-a60a-7b0c1b161d3b',
  tokenName: process.env.AUTH_TOKEN_NAME || 'x-access-token',
  default: {
    name: process.env.DEFAULT_USER_NAME || 'identity',
    email: process.env.DEFAULT_USER_EMAIL || 'identity@identity.com',
    password: process.env.DEFAULT_USER_PASSWORD || 'masterkey'
  },
  smtpConfig: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Boolean(process.env.SMTP_SECURE) || false,
    auth: {
      user: process.env.SMTP_USER || 'sammy.gutmann2@ethereal.email',
      pass: process.env.SMTP_PASS || '6FRHEGTxfJXwt1t5u6'
    }
  },
  redisConfig: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
})
