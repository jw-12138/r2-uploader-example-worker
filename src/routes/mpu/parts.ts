import {Context} from "hono"

export default async function (c: Context) {
  const uploadId = c.req.query('uploadId')
  const partNumberStr = c.req.query('partNumber') || ''
  const key = c.req.param('key')

  if (!uploadId) {
    return c.text('uploadId is required', 400)
  }

  if (!partNumberStr) {
    return c.text('partNumber is required', 400)
  }

  const partNumber = Number(partNumberStr)

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
