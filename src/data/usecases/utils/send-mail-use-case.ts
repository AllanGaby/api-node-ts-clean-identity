import { SendMailUseCase, SendMailDTO } from '@/domain/usecases/utils'
import { MailTemplateAdapter, SendMailAdapter } from '@/data/protocols/comunication/mail'
import { ExecuteQueue } from '@/data/protocols/message-queue'

export class DbSendMailUseCase implements SendMailUseCase, ExecuteQueue {
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

  async execute (data: SendMailDTO): Promise<void> {
    return await this.sendMail(data)
  }
}
