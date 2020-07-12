const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library')
const auth = require('./auth')
const jwt = require('jsonwebtoken')
const RandExp = require('randexp')
const client = new OAuth2Client()
const clientId = process.env.GOOGLE_CLIENT_ID ||
  require('../env.json').googleClientId
const secret = process.env.SECRET ||
  require('../env.json').secret
const idGen = new RandExp(/[a-zA-Z0-9]{8}/)

router.get('/', auth.auth)
router.post('/image', auth.auth)
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email'], where: { email: req.auth.email }
    })
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    if (req.body.idToken) {
      const ticket = await client.verifyIdToken({
        idToken: req.body.idToken, audience: clientId
      })
      const payload = ticket.getPayload()
      req.body.name = payload.name
      req.body.email = payload.email
    }
    req.body.id = idGen.gen()
    const user = await User.create(req.body, {
      fields: ['id', 'name', 'email', 'password']
    })
    res.send({ token: jwt.sign({ email: user.email }, secret) })
  } catch {
    res.status(500).end()
  }
})

router.get('/image/:userId', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['image'], where: { id: req.params.userId }
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
