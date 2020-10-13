const express = require('express')
const router = express.Router()
const { Sequelize, Friendship, Image } = require('../models')
const { auth, createUserToken, checkPassword } = require('./auth')
const { wrap } = require('../utils/errorHandlers')
const {
  notifyFriendRequest, notifyFriendAccepted, notifyFriendRejected
} = require('../services/notifications')

router.use(auth('user'))
router.post('/image', express.raw({ limit: 5e6, type: '*/*' }))

router.get('/', (req, res) => {
  const json = req.user.toJSON()
  delete json.password
  res.send(json)
})

router.put('/', wrap(async (req, res) => {
  const { password, values } = req.body
  if (!req.user.isGoogleUser && password !== undefined) {
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
  if (req.user.isGoogleUser) {
    await Image.delete({ userId: req.user.id })
    await req.user.destroy()
  } else if (await checkPassword(req.body.password, req.user)) {
    await Image.delete({ userId: req.user.id })
    await req.user.destroy()
  } else {
    res.status(401)
  }
  res.end()
}))

router.post('/image', wrap(async (req, res) => {
  await Image.delete({ id: req.user.image })
  if (req.body.length) {
    const image = await Image.create({
      userId: req.user.id, data: req.body
    })
    req.user.update({ image: image.id })
  } else {
    req.user.update({ image: null })
  }
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
    notifyFriendRequest(req.user.id, req.body.user)
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
    notifyFriendAccepted(req.user.id, req.body.user)
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
    notifyFriendRejected(req.user.id, req.body.user)
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/friendships', wrap(async (req, res) => {
  res.send(await req.user.getFriendships())
}))

router.get('/friendships/:userId', wrap(async (req, res) => {
  const friendship = await req.user.getFriendshipWith(req.params.userId)
  if (friendship) {
    res.send(friendship)
  } else {
    res.status(404).end()
  }
}))

module.exports = router
