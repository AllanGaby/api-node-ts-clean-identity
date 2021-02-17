import components from '@/main/docs/components'
import schemas from '@/main/docs/schemas'
import paths from '@/main/docs/paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS Identity API',
    description: 'API Criada para praticar os conceitos de Clean Architecture e TDD. <br/> ' +
                 'A API consiste em um sistema de cadastro de usuários, autenticação e alteração da conta.<br/> ' +
                 'Para que o usuário possa se autenticar na API, primeiro é preciso ativar a conta através de um link enviado para o e-mail que foi cadastrado. <br/>' +
                 'A API também permite o upload de uma imagem para ser usada como avatar do usuário.',
    version: '1.0.0',
    contact: {
      name: 'Allan Gaby',
      email: 'allan.gaby@gmail.com',
      url: 'https://www.linkedin.com/in/allan-gaby'
    }
  },
  servers: [{
    url: '/api',
    description: 'Identity API'
  }],
  paths,
  schemas,
  components
}
