const router = require('express').Router()
const { Notification } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.use('/', auth('user'))

router.get('/', wrap(async (req, res) => {
  res.send(await Notification.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  }))
}))

router.put('/:id', wrap(async (req, res) => {
  const result = await Notification.update({
    isRead: req.body.isRead
  }, {
    where: { id: req.params.id, userId: req.user.id }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/:id', wrap(async (req, res) => {
  const result = await Notification.destroy({
    where: { id: req.params.id, userId: req.user.id }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

module.exports = router
