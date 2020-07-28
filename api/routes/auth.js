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

function createUserToken (userId) {
  const token = jwt.sign({ id: userId }, secret)
  return token
}

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'email', 'password'],
      where: { email: req.body.email }
    })
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({ token: createUserToken(user.id) })
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
    let user = await User.findOne({
      attributes: ['id', 'email', 'password'],
      where: { email: payload.email }
    })
    if (user) {
      res.send({ token: createUserToken(user.id) })
    } else {
      user = await User.create({
        name: payload.name, email: payload.email
      })
      res.status(201).send({
        token: createUserToken(user.id),
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
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

module.exports = { router, auth, createUserToken }
