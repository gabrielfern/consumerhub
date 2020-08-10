const express = require('express')
const router = express.Router()
const { Review, ReviewVote } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.post('/', auth('user'))
router.get('/:id', auth())
router.put('/:id', auth('user'))
router.delete('/:id', auth('user'))
router.get('/:id/votes', auth())
router.post('/:id/votes', auth('user'))
router.delete('/:id/votes', auth('user'))

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
  const result = await Review.destroy({
    where: {
      id: req.params.id, userId: req.user.id
    }
  })
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

module.exports = router
