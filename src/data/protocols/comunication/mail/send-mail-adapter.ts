export interface Contact {
  name: string
  email: string
}

export interface SendMailDTO {
  sender: Contact
  to: Contact
  subject: string
  content: string
}

export interface SendMailAdapter {
  sendMail: (data: SendMailDTO) => Promise<void>
}
