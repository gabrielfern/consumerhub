const express = require('express')
const router = express.Router()
const { Product } = require('../models')

router.post('/image/:productId/:imageNumber', express.raw({
  limit: 5e6, type: '*/*'
}))

router.get('/', async (req, res) => {
  try {
    res.send(await Product.findAll({
      attributes: ['id', 'name', 'description']
    }))
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
      attributes: ['id', 'name', 'description'],
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

router.get('/image/:productId/:imageNumber', async (req, res) => {
  try {
    const imageNumber = `image${req.params.imageNumber}`
    const product = await Product.findOne({
      attributes: [imageNumber],
      where: { id: req.params.productId }
    })
    res.set('Content-Type', 'image')
    res.send(product[imageNumber])
  } catch {
    res.status(500).end()
  }
})

router.post('/image/:productId/:imageNumber', async (req, res) => {
  try {
    const imageNumber = `image${req.params.imageNumber}`
    await Product.update({ [imageNumber]: req.body }, {
      where: { id: req.params.productId }
    })
    res.end()
  } catch {
    res.status(500).end()
  }
})

router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    res.send(await product.getReviews())
  } catch {
    res.status(500).end()
  }
})

module.exports = router
