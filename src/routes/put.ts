import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')
  const file = await c.req.blob()
  const bucket = c.env.R2_BUCKET as R2Bucket

  if (!key) {
    return c.text('file name is required', 400)
  }

  await bucket.put(key, file, {
    httpMetadata: {
      contentType: file.type
    }
  })

  return c.text('Done')
}
