import { MailTemplateAdapter, MailTemplateDTO } from '@/data/protocols/comunication/mail'
import handlebars from 'handlebars'
import fs from 'fs'

export class HandlebarsMailTemplateAdapter implements MailTemplateAdapter {
  async parse ({ filePath, variables }: MailTemplateDTO): Promise<string> {
    const templateContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })
    const parseTemplate = handlebars.compile(templateContent)
    return parseTemplate(variables)
  }
}
