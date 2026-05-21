import dotenv from 'dotenv'
import express from 'express'

const app = express()
dotenv.config()
const port = 9000

const env = process.env.port
console.log("env port",env);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})