const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { auth, createUserToken } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.get('/', auth('admin'))
router.get('/:id', auth())
router.put('/:id', auth('admin'))
router.put('/:id', auth('admin'))
router.delete('/:id', auth('mod'))

router.get('/', wrap(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'image'] }
  })
  res.send(users)
}))

router.post('/', wrap(async (req, res) => {
  const user = await User.createFromObj(req.body)
  res.send({ token: createUserToken(user), user })
}))

router.get('/:id', wrap(async (req, res) => {
  const attributes = ['id', 'name']
  if (req.user && User[req.user.type] > User.user) {
    attributes.push('type', 'email')
  }
  const user = await User.findByPk(req.params.id, {
    attributes
  })
  if (user) {
    res.send(user)
  } else {
    res.status(404).end()
  }
}))

router.put('/:id', wrap(async (req, res) => {
  const result = await User.update(req.body, {
    fields: ['type'],
    where: { id: req.params.id }
  })
  if (result[0]) {
    res.send()
  } else {
    res.status(404).end()
  }
}))

router.delete('/:id', wrap(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'type']
  })
  if (user) {
    if (req.user.type === 'admin' ||
    User[req.user.type] > User[user.type]) {
      await user.destroy()
      res.send()
    } else {
      res.status(403).end()
    }
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

module.exports = router
