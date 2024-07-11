import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let uploadId = c.req.query('uploadId')
  let partNumberStr = c.req.query('partNumber') || ''
  let key = c.req.param('key')

  if (!uploadId) {
    return c.text('uploadId is required', 400)
  }

  if (!partNumberStr) {
    return c.text('partNumber is required', 400)
  }

  let partNumber = Number(partNumberStr)

  if (isNaN(partNumber)) {
    return c.text('partNumber must be a number', 400)
  }

  const multipartUpload = c.env.R2_BUCKET.resumeMultipartUpload(
    key,
    uploadId
  )

  try {
    const uploadedPart: R2UploadedPart =
      await multipartUpload.uploadPart(partNumber, c.req.raw.body)
    return new Response(JSON.stringify(uploadedPart))
  } catch (error: any) {
    return new Response(error.message, {status: 400})
  }
}
