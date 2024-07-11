import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let key = c.req.param('key')

  let object = await c.env.R2_BUCKET.get(key)

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
