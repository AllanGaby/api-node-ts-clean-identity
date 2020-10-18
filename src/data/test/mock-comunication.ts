import { SendMailAdapter, SendMailDTO, MailTemplateAdapter, MailTemplateDTO } from '@/data/protocols/comunication/mail'

export class SendMailAdapterSpy implements SendMailAdapter {
  sendMailParams: SendMailDTO

  async sendMail (data: SendMailDTO): Promise<void> {
    this.sendMailParams = data
  }
}

export class MailTemplateAdapterSpy implements MailTemplateAdapter {
  variables: MailTemplateDTO
  mailParsed: string

  async parse (variables: MailTemplateDTO): Promise<string> {
    this.variables = variables
    return this.mailParsed
  }
}
