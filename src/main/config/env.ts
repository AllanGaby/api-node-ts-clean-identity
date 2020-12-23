import { SMTPConfig } from '@/infra/comunication'

export interface Env {
  port: string | number
  baseDir: string
  urlRabbitMQ: string
  jwtSecret: string
  smtpConfig: SMTPConfig
}

export const EnvConfig: Env = ({
  port: process.env.PORT || 3333,
  urlRabbitMQ: process.env.URL_RABBITMQ || 'amqp://identity:masterkey@localhost:5672',
  baseDir: process.env.BASEDIR || 'src',
  jwtSecret: process.env.JWT_SECRET || '01c383ef-b869-43f6-a60a-7b0c1b161d3b',
  smtpConfig: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Boolean(process.env.SMTP_SECURE) || false,
    auth: {
      user: process.env.SMTP_USER || 'sammy.gutmann2@ethereal.email',
      pass: process.env.SMTP_PASS || '6FRHEGTxfJXwt1t5u6'
    }
  }
})
