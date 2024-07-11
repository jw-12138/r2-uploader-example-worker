import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let key = c.req.param('key')
  let uploadId = c.req.query('uploadId')

  if (!uploadId) {
    return c.text('uploadId is required', 400)
  }

  const multipartUpload = c.env.R2_BUCKET.resumeMultipartUpload(
    key,
    uploadId
  )

  try {
    await multipartUpload.abort();
  } catch (error: any) {
    return new Response(error.message, {status: 400})
  }
  return new Response(null, {status: 204})
}
