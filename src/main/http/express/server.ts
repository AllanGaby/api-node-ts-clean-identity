import 'module-alias/register'
import app from '@/main/config/express/app'
import { EnvConfig } from '@/main/config/env'

app.listen(EnvConfig.port, () => {
  console.log(`🚀 Server started on port ${EnvConfig.port}!`)
})
