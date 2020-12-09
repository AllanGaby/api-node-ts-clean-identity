import components from '@/main/docs/components'
import schemas from '@/main/docs/schemas'
import paths from '@/main/docs/paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS Identity API',
    description: 'API to identity and authenticate users. Developed using Node JS with Typescript, Clean code and Clean Architecture and without database integration for validation the application domain.',
    version: '1.0.0'
  },
  servers: [{
    url: '/api',
    description: 'Identity API'
  }],
  tags: [{
    name: 'Authentication'
  }],
  paths,
  schemas,
  components
}
