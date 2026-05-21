import app from "./app"
import { initDB } from "./db"

const port = process.env.PORT as string

function main (){
  initDB()
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}

main()