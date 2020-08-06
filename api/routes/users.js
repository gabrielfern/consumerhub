const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { auth, createUserToken, checkPassword } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.get('/', auth('user'))
router.put('/', auth('user'))
router.delete('/', auth('user'))
router.post('/image', auth('user'))
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', (req, res) => {
  const json = req.user.toJSON()
  delete json.password
  res.send(json)
})

router.post('/', wrap(async (req, res) => {
  const user = await User.createFromObj(req.body)
  res.send({ token: createUserToken(user), user })
}))

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

router.get('/:id', wrap(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'name']
  })
  if (user) {
    res.send(user)
  } else {
    res.status(404).end()
  }
}))

router.get('/:id/image', wrap(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['image']
  })
  if (user && user.image) {
    res.set('Content-Type', 'image')
    res.send(user.image)
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
