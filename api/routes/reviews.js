const express = require('express')
const router = express.Router()
const { Review } = require('../models')

router.get('/', async (req, res) => {
  try {
    res.send(await Review.findAll())
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    res.send(await Review.create(req.body))
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    res.send(await Review.findOne({
      where: { id: req.params.id }
    }))
  } catch {
    res.status(500).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
    await Review.update(req.body, {
      where: { id: req.params.id }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Review.destroy({
      where: { id: req.params.id }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

module.exports = router
