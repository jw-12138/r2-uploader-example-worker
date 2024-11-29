import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')

  const object = await c.env.R2_BUCKET.get(key)

  if (object === null) {
    return new Response('Object Not Found', {status: 404})
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(object.body, {
    headers
  })
}
