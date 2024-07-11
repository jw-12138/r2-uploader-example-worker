import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let key = c.req.param('key')
  let file = await c.req.blob()

  if (!key) {
    return c.text('file name is required', 400)
  }

  await c.env.R2_BUCKET.put(key, file)

  return c.text('Done')
}
