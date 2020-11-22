import { SendMailAdapter, SendMailDTO } from '@/data/protocols/comunication/mail'
import nodemailer, { Transporter } from 'nodemailer'

export interface SMTPConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export class NodemailerSendMailAdapter implements SendMailAdapter {
  private readonly client: Transporter

  constructor ({ host, port, secure, auth }: SMTPConfig) {
    this.client = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: auth.user,
        pass: auth.pass
      }
    })
  }

  async sendMail ({ sender, to, subject, content }: SendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: sender?.name || 'Identity',
        address: sender?.email || 'contact@identity.com.br'
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
