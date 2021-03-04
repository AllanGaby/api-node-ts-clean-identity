import 'module-alias/register'
import { EnvConfig } from '@/main/config/environment'
import { createTypeOrmConnection } from '@/infra/db/typeorm/connections'

createTypeOrmConnection(EnvConfig.databaseConfig.host).then(async () => {
  const app = (await import('@/main/config/express/app')).default
  app.listen(EnvConfig.port, () => {
    console.log(`🚀 Server started on port ${EnvConfig.port}!`)
  })
}).catch(error => {
  console.error(error)
})
