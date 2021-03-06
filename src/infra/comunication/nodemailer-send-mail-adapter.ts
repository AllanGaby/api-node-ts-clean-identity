import { SendMailAdapter, SendMailDTO } from '@/data/protocols/comunication/mail'
import nodemailer, { Transporter } from 'nodemailer'

export interface SMTPConfig {
  host?: string
  port?: number
  secure?: boolean
  service?: string
  auth: {
    user: string
    pass: string
  }
}

export class NodemailerSendMailAdapter implements SendMailAdapter {
  client: Transporter

  constructor ({ host, port, secure, auth, service }: SMTPConfig) {
    if (service) {
      this.client = nodemailer.createTransport({
        service,
        auth: {
          user: auth.user,
          pass: auth.pass
        }
      })
    } else {
      this.client = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: auth.user,
          pass: auth.pass
        },
        tls: {
          rejectUnauthorized: false
        }
      })
    }
  }

  async sendMail ({ sender, to, subject, content }: SendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: sender.name,
        address: sender.email
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: content
    })
  }
}
