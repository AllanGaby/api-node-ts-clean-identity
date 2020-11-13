import { SendMailAdapter, SendMailDTO } from '@/data/protocols/comunication/mail'
import nodemailer, { Transporter } from 'nodemailer'

export class NodemailerSendMailAdapter implements SendMailAdapter {
  private client: Transporter

  constructor () {
    nodemailer.createTestAccount().then(account => {
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
    })
  }

  async sendMail ({ sender, to, subject, content }: SendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
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

    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)

    return message.messageId
  }
}
