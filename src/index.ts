import {Context, Hono} from 'hono'
import {cors} from 'hono/cors'
import Get from './routes/get'
import Patch from './routes/patch'
import Put from './routes/put'
import Delete from "./routes/delete"

const app = new Hono()

const validHeader = function (c: Context) {
  if(!c.env.AUTH_KEY_SECRET){
    return c.text('AUTH_KEY_SECRET is not set', 403)
  }

  const useKey = c.req.header('x-api-key') === c.env.AUTH_KEY_SECRET

  if (c.req.method === 'GET') {
    if (c.env.PRIVATE_BUCKET) {
      return useKey
    } else {
      return true
    }
  }

  if (c.req.method === 'PATCH' || c.req.method === 'PUT' || c.req.method === 'DELETE') {
    return useKey
  }

  if (c.req.method === 'OPTIONS') {
    return true
  }

  return false
}

app.use(async function (c, next) {
  let valid = validHeader(c)

  if (valid) {
    console.log('Header is valid')
    await next()
  }

  return c.json({
    status: 401,
    message: 'Unauthorized'
  })
})

app.use(cors())

app.get('/', (c) => c.text('Hello R2!'))

app.get('/:key{.*}', Get)

app.patch('/', Patch)

app.put('/:key{.*}', Put)

app.delete('/:key{.*}', Delete)

app.all('*', c => {
  return c.text('404 Not Found')
})

export default app
