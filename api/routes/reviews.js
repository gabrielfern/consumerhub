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

module.exports = router
