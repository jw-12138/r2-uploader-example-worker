import {Context} from "hono"

export default async function (c: Context) {
  const cursor = c.req.query('cursor')
  const list = await c.env.R2_BUCKET.list({
    cursor: cursor || undefined
  })

  return c.json(list)
}
