import { SendMailAdapter, SendMailDTO, MailTemplateAdapter, MailTemplateDTO } from '@/data/protocols/comunication/mail'

export class SendMailAdapterSpy implements SendMailAdapter {
  sendMailParams: SendMailDTO

  async sendMail (data: SendMailDTO): Promise<void> {
    this.sendMailParams = data
  }
}

export class MailTemplateAdapterSpy implements MailTemplateAdapter {
  parseParams: MailTemplateDTO
  mailParsed: string

  async parse (parseParams: MailTemplateDTO): Promise<string> {
    this.parseParams = parseParams
    return this.mailParsed
  }
}
