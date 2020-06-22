const path = require('path')
const express = require('express')
const usersRouter = require('./routes/users')
const rootPath = path.dirname(__dirname)
const buildPath = path.join(rootPath, 'app', 'build')
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.static(buildPath))
app.use('/api/users', usersRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
