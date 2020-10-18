export interface MailTemplateVariables {
  [key: string]: string | number
}

export interface MailTemplateDTO {
  variables: MailTemplateVariables
  filePath: string
}

export interface MailTemplateAdapter {
  parse: (data: MailTemplateDTO) => Promise<string>
}
