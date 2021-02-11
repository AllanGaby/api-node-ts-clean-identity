export interface SendMailVariables {
  [key: string]: string | number
}

export interface SendMailContact {
  name: string
  email: string
}

export interface SendMailDTO {
  variables: SendMailVariables
  templateFileName: string
  sender?: SendMailContact
  to: SendMailContact
  subject: string
}

export interface SendMailUseCase {
  sendMail: (data: SendMailDTO) => Promise<void>
}
