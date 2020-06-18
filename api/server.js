const express = require('express')
const usersRouter = require('./routes/users')
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.static('../app/build'))

app.use('/api/users', usersRouter)

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
