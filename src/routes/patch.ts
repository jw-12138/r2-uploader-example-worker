import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function (c: Context) {
  let cursor = c.req.query('cursor')
  let list = await c.env.R2_BUCKET.list({
    cursor: cursor || undefined
  })

  return c.json(list)
}
