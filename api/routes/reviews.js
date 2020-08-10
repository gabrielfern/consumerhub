const express = require('express')
const router = express.Router()
const { Review, ReviewVote, ReviewReport, User } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.post('/', auth('user'))
router.get('/:id', auth())
router.put('/:id', auth('user'))
router.delete('/:id', auth('user'))
router.get('/:id/votes', auth())
router.post('/:id/votes', auth('user'))
router.delete('/:id/votes', auth('user'))
router.get('/:id/reports', auth('mod'))
router.post('/:id/reports', auth('user'))
router.delete('/:id/reports', auth('user'))

router.get('/', wrap(async (req, res) => {
  res.send(await Review.findAll())
}))

router.post('/', wrap(async (req, res) => {
  const review = await Review.create({
    text: req.body.text,
    rating: req.body.rating,
    userId: req.user.id,
    productId: req.body.productId
  })
  res.send(review)
}))

router.get('/:id', wrap(async (req, res) => {
  const review = await Review.findByPk(req.params.id)
  if (review) {
    const userId = req.user && req.user.id
    review.setDataValue('votes', await review.getVoteCounts(userId))
    res.send(review)
  } else {
    res.status(404).end()
  }
}))

router.put('/:id', wrap(async (req, res) => {
  const result = await Review.update(req.body, {
    fields: ['text', 'rating'],
    where: {
      id: req.params.id, userId: req.user.id
    }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/:id', wrap(async (req, res) => {
  const where = { id: req.params.id }
  if (User.map[req.user.type] < User.map.mod) {
    where.userId = req.user.id
  }
  const result = await Review.destroy({ where })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/:id/votes', wrap(async (req, res) => {
  const review = await Review.findByPk(req.params.id)
  if (review) {
    const userId = req.user && req.user.id
    res.send(await review.getVoteCounts(userId))
  } else {
    res.status(404).end()
  }
}))

router.post('/:id/votes', wrap(async (req, res) => {
  const result = await ReviewVote.upsert({
    type: req.body.type,
    userId: req.user.id,
    reviewId: req.params.id
  })
  if (result) {
    res.status(201).end()
  } else {
    res.end()
  }
}))

router.delete('/:id/votes', wrap(async (req, res) => {
  const result = await ReviewVote.destroy({
    where: {
      userId: req.user.id, reviewId: req.params.id
    }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/:id/reports', wrap(async (req, res) => {
  const review = await Review.findByPk(req.params.id)
  if (review) {
    res.send(await review.getReports())
  } else {
    res.status(404).end()
  }
}))

router.post('/:id/reports', wrap(async (req, res) => {
  const result = await ReviewReport.upsert({
    text: req.body.text,
    userId: req.user.id,
    reviewId: req.params.id
  })
  if (result) {
    res.status(201).end()
  } else {
    res.end()
  }
}))

router.delete('/:id/reports', wrap(async (req, res) => {
  let userId = req.user.id
  if (User.map[req.user.type] > User.map.user && req.body.userId) {
    userId = req.body.userId
  }
  const result = await ReviewReport.destroy({
    where: {
      userId, reviewId: req.params.id
    }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

module.exports = router
