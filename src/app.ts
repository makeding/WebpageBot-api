import Koa from 'koa'
import KoaBodyparser from 'koa-bodyparser'
import http from 'http'
import { Client } from 'tdl'
import { TDLib } from 'tdl-tdlib-addon'

const app = new Koa()

const client = new Client(new TDLib(), {
  apiId: 179502,
  apiHash: 'fb9edfa0448a501fc57f3cdd19739a8a',
})

app.use(KoaBodyparser())
app.use(async (ctx) => {
  let url = (ctx.request.body && ctx.request.body.url) ? ctx.request.body.url : ctx.request.url.substr(1)
  console.log(new Date(), url)
  if (url) {
    try {
      new URL(url)
      await client.invoke({
        _: 'sendMessage',
        chat_id: 169642392, // @webpagebot
        input_message_content: {
          _: 'inputMessageText',
          text: {
            _: 'formattedText',
            text: url
          }
        }
      })
      ctx.body = {
        ok: true
      }
    } catch (error) {
      console.error(error)
      ctx.body = {
        ok: false
      }
    }
  }
})

const tg_initial = async () => {
  await client.connect()
  await client.login()
  http.createServer(app.callback()).listen(2344, '127.0.0.1')
  console.log('http server listening on 2344')
}
tg_initial()
