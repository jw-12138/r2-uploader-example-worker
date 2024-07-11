import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let key = c.req.param('key')

  await c.env.R2_BUCKET.delete(key)

  return new Response(null, {
    status: 204
  })
}
