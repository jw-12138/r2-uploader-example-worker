import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let key = c.req.param('key')

  const multipartUpload = await c.env.R2_BUCKET.createMultipartUpload(key)

  return c.json({
    key: multipartUpload.key,
    uploadId: multipartUpload.uploadId
  })
}
