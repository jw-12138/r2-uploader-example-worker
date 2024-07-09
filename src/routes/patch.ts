import {Context} from "hono"

export default async function(c: Context){
  let list = await c.env.R2_BUCKET.list()
  return c.json(list)
}
