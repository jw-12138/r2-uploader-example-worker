import {Context} from "hono"

export default async function (c: Context) {
  const key = c.req.param('key')
  const uploadId = c.req.query('uploadId')

  if (!uploadId) {
    return c.text('uploadId is required', 400)
  }

  const multipartUpload = c.env.R2_BUCKET.resumeMultipartUpload(
    key,
    uploadId
  )

  /**
   * [{partNumber: 1, etag: 'etag1'}, ...]
   */
  interface completeBody {
    parts: R2UploadedPart[]
  }

  let body: completeBody

  try {
    body = await c.req.json<completeBody>()
  } catch (e) {
    console.log('parsing complete body failed')
    console.log(e)
    return c.text('invalid json', 400)
  }

  try {
    const object = await multipartUpload.complete(body.parts)
    return new Response(null, {
      headers: {
        etag: object.httpEtag
      }
    })
  } catch (e: any) {
    return new Response(e.message, {status: 400})
  }
}
