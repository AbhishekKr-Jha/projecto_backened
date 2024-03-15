const dotenv=require('dotenv').config()
const express = require('express')
const app = express()
require('./Conn')
PORT=process.env.PORT

const cors=require('cors')
const router=require('./routes/router')


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))



app.use(router)


app.get('/', (req, res) => {
  res.send('Hello World!  this one is running')
})
 
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})  