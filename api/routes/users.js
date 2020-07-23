const express = require('express')
const router = express.Router()
const { User } = require('../models')
const auth = require('./auth')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET ||
  require('../env.json').secret

router.get('/', auth.auth)
router.post('/image', auth.auth)
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email'],
      where: { email: req.auth.email }
    })
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    res.send({ token: jwt.sign({ email: user.email }, secret) })
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name']
    })
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.get('/:id/image', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['image'], where: { id: req.params.id }
    })
    res.set('Content-Type', 'image')
    res.send(user.image)
  } catch {
    res.status(500).end()
  }
})

router.post('/image', async (req, res) => {
  try {
    await User.update({ image: req.body }, {
      where: { email: req.auth.email }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

module.exports = router
