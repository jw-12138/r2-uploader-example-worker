var hasValidHeader = (request, env) => {
  return request.headers.get('x-api-key') === env.AUTH_KEY_SECRET
}
function authorizeRequest(request, env, key) {
  switch (request.method) {
    case 'PUT':
      return hasValidHeader(request, env)
    case 'DELETE':
      return hasValidHeader(request, env)
    case 'PATCH':
      return hasValidHeader(request, env)
    case 'GET':
      if (env.PRIVATE_BUCKET) {
        return hasValidHeader(request, env)
      } else {
        return true
      }
    case 'OPTIONS':
      return true
    default:
      return false
  }
}
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url)
    const key = url.pathname.slice(1)
    if (!authorizeRequest(request, env, key)) {
      return new Response('Forbidden', { status: 403 })
    }
    switch (request.method) {
      case 'PUT':
        await env.R2_BUCKET.put(key, request.body)
        return new Response(`Put ${key} successfully!`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
      case 'PATCH':
        let list = await env.R2_BUCKET.list()
        return new Response(JSON.stringify(list), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
      case 'GET':
        const object = await env.R2_BUCKET.get(key)
        if (object === null) {
          return new Response('Object Not Found', { status: 404 })
        }
        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)
        headers.set('Access-Control-Allow-Origin', '*')
        return new Response(object.body, {
          headers
        })
      case 'DELETE':
        await env.R2_BUCKET.delete(key)
        return new Response('Deleted!', {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
      case 'OPTIONS':
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'PUT, PATCH, GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
          }
        })
      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            'Access-Control-Allow-Methods':
              'PUT, PATCH, GET, DELETE, OPTIONS',
            'Access-Control-Allow-Origin': '*'
          }
        })
    }
  }
}
export { worker_default as default }
