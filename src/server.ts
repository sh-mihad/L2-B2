import app from "./app"
import { initDB } from "./db"


function main (){
  initDB()
  app.listen(5000, () => {
  console.log(`App running on port ${5000}`)
})
}

main()


