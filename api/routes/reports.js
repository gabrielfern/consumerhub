const express = require('express')
const router = express.Router()
const { ReviewReport, ProductReport, UserReport } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

const model = {
  reviews: ReviewReport, products: ProductReport, users: UserReport
}
const id = {
  reviews: 'reviewId', products: 'productId', users: 'reportedId'
}

router.use('/', auth('user'))

router.get('/', wrap(async (req, res) => {
  const where = {}
  if (req.query.userId && req.user.type !== 'user') {
    where.userId = req.query.userId
  } else if (req.user.type === 'user') {
    where.userId = req.user.id
  }
  if (req.query[id[req.query.type]]) {
    where[id[req.query.type]] = req.query[id[req.query.type]]
  }
  res.send(await model[req.query.type].findAll({
    where,
    order: ['createdAt']
  }))
}))

router.post('/', wrap(async (req, res) => {
  const result = await model[req.query.type].upsert({
    text: req.body.text,
    userId: req.user.id,
    [id[req.query.type]]: req.query[id[req.query.type]]
  })
  if (result) {
    res.status(201).end()
  } else {
    res.end()
  }
}))

router.delete('/', wrap(async (req, res) => {
  const where = {
    userId: req.user.id,
    [id[req.query.type]]: req.query[id[req.query.type]]
  }
  if (req.query.userId && req.user.type !== 'user') {
    where.userId = req.query.userId
  }
  const result = await model[req.query.type].destroy({ where })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

module.exports = router
