const express = require('express')
const router = express.Router()
const { Sequelize, Friendship } = require('../models')
const { auth, createUserToken, checkPassword } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.use(auth('user'))
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', (req, res) => {
  const json = req.user.toJSON()
  delete json.password
  res.send(json)
})

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

router.get('/image', wrap(async (req, res) => {
  await req.user.reload({ attributes: ['image'] })
  if (req.user.image && req.user.image.length) {
    res.set('Content-Type', 'image')
    res.send(req.user.image)
  } else {
    res.status(404).end()
  }
}))

router.post('/image', wrap(async (req, res) => {
  await req.user.update({
    image: req.body
  })
  res.end()
}))

router.get('/friends', wrap(async (req, res) => {
  res.send(await req.user.getFriends())
}))

router.post('/friends', wrap(async (req, res) => {
  if (req.user.id !== req.body.user &&
    !await req.user.getFriendshipWith(req.body.user)) {
    const friendship = await Friendship.create({
      accepted: false,
      userId1: req.user.id,
      userId2: req.body.user
    })
    res.send(friendship)
  } else {
    res.status(400).end()
  }
}))

router.put('/friends', wrap(async (req, res) => {
  const result = await Friendship.update({
    accepted: true
  }, {
    where: {
      userId1: req.body.user,
      userId2: req.user.id
    }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/friends', wrap(async (req, res) => {
  const result = await Friendship.destroy({
    where: {
      [Sequelize.Op.or]: [{
        userId1: req.user.id,
        userId2: req.body.user
      }, {
        userId1: req.body.user,
        userId2: req.user.id
      }]
    }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/friends/invitations', wrap(async (req, res) => {
  const friendships = await req.user.getFriendships()
  res.send(friendships.filter(friendship => !friendship.accepted))
}))

module.exports = router
