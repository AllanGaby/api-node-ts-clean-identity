import app from '@/main/config/express/app'
import env from '@/main/config/env'

app.listen(env.port, () => {
  console.log(`🚀 Server started on port ${env.port}!`)
})
