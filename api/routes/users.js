const router = require('express').Router()
const { User } = require('../models')

router.post('/', (req, res) => {
  User.create(req.body).then(user => {
    res.send(user.toJSON())
  }).catch(() => {
    res.status(500).end()
  })
})

router.get('/:id', (req, res) => {
  User.findOne({ where: { id: req.params.id } }).then(user => {
    res.send(user)
  }).catch(() => {
    res.status(500).end()
  })
})

module.exports = router
