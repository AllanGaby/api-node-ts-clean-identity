import { Express, Router } from 'express'
import setupAccountRoutes from '@/main/http/express/routes/auth/account-route'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  setupAccountRoutes(router)
}
