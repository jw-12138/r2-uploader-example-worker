import {Context} from "hono"

export default function (c: Context) {
  return c.text('yes')
}
