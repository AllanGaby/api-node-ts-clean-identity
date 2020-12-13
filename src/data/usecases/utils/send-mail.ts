import { SendMail, SendMailDTO } from '@/domain/usecases/utils'
import { MailTemplateAdapter, SendMailAdapter } from '@/data/protocols/comunication/mail'

export class DbSendMail implements SendMail {
  constructor (
    private readonly mailTemplateAdapter: MailTemplateAdapter,
    private readonly sendMailAdapter: SendMailAdapter
  ) {}

  async sendMail ({ templateFileName, variables, sender, to, subject }: SendMailDTO): Promise<void> {
    const mailContent = await this.mailTemplateAdapter.parse({
      filePath: templateFileName,
      variables
    })
    await this.sendMailAdapter.sendMail({
      sender,
      to,
      subject,
      content: mailContent
    })
  }
}
