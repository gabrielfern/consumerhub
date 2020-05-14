const express = require('express')
const app = express()
const port = process.env.PORT || 8000

app.use(express.static('../app/build'))

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
