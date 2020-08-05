const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { auth, createUserToken } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.get('/', auth('user'))
router.put('/', auth('user'))
router.delete('/', auth('user'))
router.post('/image', auth('user'))
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', (req, res) => {
  res.send(req.user)
})

router.post('/', wrap(async (req, res) => {
  const user = await User.createFromObj(req.body)
  res.send({ token: createUserToken(user), user })
}))

router.put('/', wrap(async (req, res) => {
  await req.user.update(req.body, {
    fields: ['name', 'password']
  })
  res.end()
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
