const express = require('express')
const router = express.Router()
const { Review, ReviewVote } = require('../models')
const { auth } = require('./auth')

router.post('/', auth)
router.put('/:id', auth)
router.delete('/:id', auth)
router.post('/:id/votes', auth)

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
      userId: req.auth.id,
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
        id: req.params.id, userId: req.auth.id
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
        id: req.params.id, userId: req.auth.id
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
      const votes = await review.getVotes({
        attributes: ['type'], raw: true
      })
      let upvotes = 0
      let downvotes = 0
      for (const vote of votes) {
        if (vote.type === 'upvote') {
          upvotes++
        } else {
          downvotes++
        }
      }
      res.send({
        upvotes, downvotes
      })
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
      userId: req.auth.id,
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
