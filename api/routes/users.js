const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { auth, createUserToken } = require('./auth')

router.get('/', auth)
router.put('/', auth)
router.delete('/', auth)
router.post('/image', auth)
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.auth.id, {
      attributes: { exclude: ['password', 'image'] }
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
    res.send({
      token: createUserToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch {
    res.status(500).end()
  }
})

router.put('/', async (req, res) => {
  try {
    const result = await User.update(req.body, {
      fields: ['name', 'email', 'password'],
      where: { id: req.auth.id }
    })
    if (result[0]) {
      res.end()
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.delete('/', async (req, res) => {
  try {
    const result = await User.destroy({
      where: { id: req.auth.id }
    })
    if (result) {
      res.end()
    } else {
      res.status(404).end()
    }
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
    const user = await User.findByPk(req.params.id, {
      attributes: ['image']
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
      where: { id: req.auth.id }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

module.exports = router
