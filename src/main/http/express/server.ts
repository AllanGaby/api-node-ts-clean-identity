import 'module-alias/register'
import { EnvConfig } from '@/main/config/env'
import { CreateTypeOrmConnection } from '@/infra/db/typeorm/connections'

CreateTypeOrmConnection.getConnection().then(async () => {
  const app = (await import('@/main/config/express/app')).default
  app.listen(EnvConfig.port, () => {
    console.log(`🚀 Server started on port ${EnvConfig.port}!`)
  })
}).catch(console.error)
