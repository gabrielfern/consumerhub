const express = require('express')
const router = express.Router()
const { auth, createUserToken, checkPassword } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.use(auth('user'))
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', (req, res) => {
  const json = req.user.toJSON()
  delete json.password
  res.send(json)
})

router.put('/', wrap(async (req, res) => {
  const { password, values } = req.body
  if (password !== undefined) {
    if (await checkPassword(password, req.user)) {
      await req.user.updateAndInc(values)
      res.send({ token: createUserToken(req.user) })
    } else {
      res.status(401).end()
    }
  } else {
    await req.user.update({ name: values.name })
    res.end()
  }
}))

router.delete('/', wrap(async (req, res) => {
  await req.user.destroy()
  res.end()
}))

router.get('/image', wrap(async (req, res) => {
  await req.user.reload({ attributes: ['image'] })
  if (req.user.image) {
    res.set('Content-Type', 'image')
    res.send(req.user.image)
  } else {
    res.status(404).end()
  }
}))

router.post('/image', wrap(async (req, res) => {
  await req.user.update({
    image: req.body.length ? req.body : null
  })
  res.end()
}))

module.exports = router
