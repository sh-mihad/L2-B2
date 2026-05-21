import dotenv from 'dotenv'
import express from 'express'

const app = express()
dotenv.config()

app.get('/', (req, res) => {
  res.send('Welcome DevPulse Application')
})

export default app;