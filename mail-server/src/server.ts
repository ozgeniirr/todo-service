import 'dotenv/config'
import express from 'express'

const app = express()
app.get('/health', (_req, res) => res.json({ ok: true }))

const port = Number(process.env.PORT || 4001)
app.listen(port, () => {
  console.log(`mail-server listening on ${port}`)
})