import {Context} from "hono"

interface Env {
  R2_BUCKET: R2Bucket;
}

export default async function(c: Context){
  let list = await c.env.R2_BUCKET.list()
  return c.json(list)
}
