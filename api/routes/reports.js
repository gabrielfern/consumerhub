const express = require('express')
const router = express.Router()
const { ReviewReport } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.use('/', auth('user'))

router.get('/', wrap(async (req, res) => {
  const where = {}
  if (req.query.userId && req.user.type !== 'user') {
    where.userId = req.query.userId
  } else if (req.user.type === 'user') {
    where.userId = req.user.id
  }
  if (req.query.reviewId) {
    where.reviewId = req.query.reviewId
  }
  res.send(await ReviewReport.findAll({ where }))
}))

router.post('/', wrap(async (req, res) => {
  const result = await ReviewReport.upsert({
    text: req.body.text,
    userId: req.user.id,
    reviewId: req.query.reviewId
  })
  if (result) {
    res.status(201).end()
  } else {
    res.end()
  }
}))

router.delete('/', wrap(async (req, res) => {
  const where = {
    userId: req.user.id, reviewId: req.query.reviewId
  }
  if (req.query.userId && req.user.type !== 'user') {
    where.userId = req.query.userId
  }
  const result = await ReviewReport.destroy({ where })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

module.exports = router
