const path = require('path')
const express = require('express')
const usersRouter = require('./routes/users')
const userRouter = require('./routes/user')
const productsRouter = require('./routes/products')
const reviewsRouter = require('./routes/reviews')
const emailRouter = require('./routes/email')
const friendsRouter = require('./routes/friends')
const stagingRouter = require('./routes/staging')
const auth = require('./routes/auth')
const rootPath = path.dirname(__dirname)
const buildPath = path.join(rootPath, 'app', 'build')
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.static(buildPath))
app.use('/api/users', usersRouter)
app.use('/api/user', userRouter)
app.use('/api/products', productsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/email', emailRouter)
app.use('/api/friends', friendsRouter)
app.use('/api/staging', stagingRouter)
app.use('/api/auth', auth.router)

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
