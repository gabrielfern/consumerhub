const express = require('express')
const router = express.Router()
const { Product } = require('../models')

router.get('/', async (req, res) => {
  try {
    res.send(await Product.findAll())
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    res.send(await Product.create(req.body))
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    res.send(await Product.findOne({
      where: { id: req.params.id }
    }))
  } catch {
    res.status(500).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: { id: req.params.id }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Product.destroy({
      where: { id: req.params.id }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

module.exports = router
