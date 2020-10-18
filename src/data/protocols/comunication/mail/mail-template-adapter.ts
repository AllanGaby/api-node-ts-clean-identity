export interface MailTemplateDTO {
  [key: string]: string | number
}

export interface MailTemplateAdapter {
  parse: (data: MailTemplateDTO) => Promise<string>
}
