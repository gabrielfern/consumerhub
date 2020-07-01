const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client()
const clientId = process.env.GOOGLE_CLIENT_ID ||
  require('../env.json').googleClientId

router.use('/:id/image', express.raw({ limit: 5e6, type: '*/*' }))

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
    const user = await User.create(req.body, {
      fields: ['name', 'email', 'password']
    })
    delete user.dataValues.password
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email'], where: { id: req.params.id }
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

router.post('/:id/image', async (req, res) => {
  try {
    await User.update({ image: req.body }, { where: { id: req.params.id } })
    res.end()
  } catch {
    res.status(500).end()
  }
})

module.exports = router
