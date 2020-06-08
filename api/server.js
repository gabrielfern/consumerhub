const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const { sequelize } = require('./models')

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(express.static('../app/build'))

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
