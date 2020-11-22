import { SendMailAdapter, SendMailDTO } from '@/data/protocols/comunication/mail'
import nodemailer, { Transporter } from 'nodemailer'

export class NodemailerSendMailAdapter implements SendMailAdapter {
  private readonly client: Transporter

  constructor () {
    this.client = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'sammy.gutmann2@ethereal.email',
        pass: '6FRHEGTxfJXwt1t5u6'
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
