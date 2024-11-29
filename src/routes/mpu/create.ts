import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')

  const multipartUpload = await c.env.R2_BUCKET.createMultipartUpload(key)

  return c.json({
    key: multipartUpload.key,
    uploadId: multipartUpload.uploadId
  })
}
