import { Express } from 'express'
import authRouter from '@/main/http/express/routes/auth'

export default (app: Express): void => {
  app.use('/api/auth', authRouter())
}
