const express = require('express')
const router = express.Router()
const { Review, ReviewVote } = require('../models')
const { auth } = require('./auth')

router.post('/', auth('user'))
router.put('/:id', auth('user'))
router.delete('/:id', auth('user'))
router.post('/:id/votes', auth('user'))

router.get('/', async (req, res) => {
  try {
    res.send(await Review.findAll())
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    const review = await Review.create({
      text: req.body.text,
      rating: req.body.rating,
      userId: req.user.id,
      productId: req.body.productId
    })
    res.send(review)
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (review) {
      res.send(review)
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
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
  } catch {
    res.status(500).end()
  }
})

router.delete('/:id', async (req, res) => {
  try {
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
  } catch {
    res.status(500).end()
  }
})

router.get('/:id/votes', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (review) {
      res.send(await review.getVoteCounts())
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.post('/:id/votes', async (req, res) => {
  try {
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
  } catch {
    res.status(500).end()
  }
})

module.exports = router
