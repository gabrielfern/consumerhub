const express = require('express')
const router = express.Router()
const { Sequelize, Friendship } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.all('/', auth('user'))
router.get('/invitations', auth('user'))

router.get('/', wrap(async (req, res) => {
  res.send(await req.user.getFriends())
}))

router.post('/', wrap(async (req, res) => {
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

router.put('/', wrap(async (req, res) => {
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

router.delete('/', wrap(async (req, res) => {
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

router.get('/invitations', wrap(async (req, res) => {
  const friendships = await req.user.getFriendships()
  res.send(friendships.filter(friendship => !friendship.accepted))
}))

module.exports = router
