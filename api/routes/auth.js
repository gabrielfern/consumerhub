const router = require('express').Router()
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { wrap } = require('../utils/errorHandlers')
const client = new OAuth2Client()
const clientId = process.env.GOOGLE_CLIENT_ID ||
  require('../env.json').googleClientId
const secret = process.env.SECRET ||
  require('../env.json').secret

function createUserToken (user) {
  const token = jwt.sign({
    id: user.id,
    tokenVersion: user.tokenVersion
  }, secret)
  return token
}

function checkPassword (password, user) {
  return bcrypt.compare(password, user.password)
}

router.post('/', wrap(async (req, res) => {
  const user = await User.getByEmail(req.body.email)
  if (!user) {
    res.status(404).end()
  } else if (!user.isGoogleUser &&
    await checkPassword(req.body.password, user)) {
    res.send({ token: createUserToken(user) })
  } else {
    res.status(401).end()
  }
}))

router.post('/google', wrap(async (req, res) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken, audience: clientId
  })
  const payload = ticket.getPayload()
  let user = await User.getByEmail(payload.email)
  if (user && user.isGoogleUser) {
    res.send({ token: createUserToken(user) })
  } else if (user) {
    res.status(401).end()
  } else {
    user = await User.createFromObj(payload, true)
    res.status(201).send({
      token: createUserToken(user), user
    })
  }
}))

function auth (userType) {
  return wrap(async (req, res, next) => {
    if (!userType && !req.headers.token) {
      next()
    } else if (userType && !req.headers.token) {
      res.status(401).end()
    } else {
      const payload = jwt.verify(req.headers.token, secret)
      const user = await User.getById(payload.id)

      if (!user) {
        res.status(404).end()
      } else if (user.tokenVersion > payload.tokenVersion) {
        res.status(401).end()
      } else if (userType &&
        User[userType] > User[user.type]) {
        res.status(403).end()
      } else {
        req.user = user
        next()
      }
    }
  })
}

module.exports = { router, auth, createUserToken, checkPassword }
