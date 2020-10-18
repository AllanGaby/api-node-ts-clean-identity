import { SendMailAdapter, SendMailDTO } from '@/data/protocols/comunication/mail/send-mail-adapter'

export class SendMailAdapterSpy implements SendMailAdapter {
  sendMailParams: SendMailDTO

  async sendMail (data: SendMailDTO): Promise<void> {
    this.sendMailParams = data
  }
}
