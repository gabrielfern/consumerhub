const router = require('express').Router()
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const client = new OAuth2Client()
const clientId = process.env.GOOGLE_CLIENT_ID ||
  require('../env.json').googleClientId
const secret = process.env.SECRET ||
  require('../env.json').secret

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['email', 'password'],
      where: { email: req.body.email }
    })
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({ token: jwt.sign({ email: user.email }, secret) })
    } else {
      res.status(401).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.post('/google', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken, audience: clientId
    })
    const payload = ticket.getPayload()
    const user = await User.findOne({
      attributes: ['email', 'password'],
      where: { email: payload.email }
    })
    if (user) {
      res.send({ token: jwt.sign({ email: user.email }, secret) })
    } else {
      await User.create({
        name: payload.name, email: payload.email
      })
      res.status(201).send({
        token: jwt.sign({ email: payload.email }, secret)
      })
    }
  } catch {
    res.status(500).end()
  }
})

function auth (req, res, next) {
  jwt.verify(req.headers.token, secret, (err, payload) => {
    if (err) {
      res.status(401).end()
    } else {
      req.auth = payload
      next()
    }
  })
}

module.exports = { router, auth }
