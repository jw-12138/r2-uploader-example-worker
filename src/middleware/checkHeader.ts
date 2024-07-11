import {Context, Next} from "hono";

function validHeader (c: Context) {
  if (!c.env.AUTH_KEY_SECRET) {
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

  let useKeyMethods = ['POST', 'PATCH', 'PUT', 'DELETE']

  if (useKeyMethods.includes(c.req.method)) {
    return useKey
  }

  if (c.req.method === 'OPTIONS') {
    return true
  }

  return false
}

export default async function (c: Context, next: Next) {
  let valid = validHeader(c)

  if (valid) {
    console.log('Header is valid')
    await next()
  }

  return c.json({
    status: 401,
    message: 'Unauthorized'
  })
}
