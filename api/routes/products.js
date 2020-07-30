const express = require('express')
const router = express.Router()
const { Product } = require('../models')

router.post('/:id/image/:imageNumber', express.raw({
  limit: 5e6, type: '*/*'
}))

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        'id', 'name', 'description', 'createdAt', 'updatedAt'
      ]
    })
    res.send(products)
  } catch {
    res.status(500).end()
  }
})

router.post('/', async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description
    })
    res.send({
      id: product.id,
      name: product.name,
      description: product.description
    })
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'id', 'name', 'description', 'createdAt', 'updatedAt'
      ]
    })
    if (product) {
      res.send(product)
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.put('/:id', async (req, res) => {
  try {
    const result = await Product.update(req.body, {
      fields: ['name', 'description'],
      where: { id: req.params.id }
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
    const result = await Product.destroy({
      where: { id: req.params.id }
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

router.get('/:id/image/:imageNumber', async (req, res) => {
  try {
    const imageNumber = `image${req.params.imageNumber}`
    const product = await Product.findByPk(req.params.id, {
      attributes: [imageNumber]
    })
    if (product && product[imageNumber]) {
      res.set('Content-Type', 'image')
      res.send(product[imageNumber])
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

router.post('/:id/image/:imageNumber', async (req, res) => {
  try {
    const imageNumber = `image${req.params.imageNumber}`
    const result = await Product.update({
      [imageNumber]: req.body.length ? req.body : null
    }, {
      where: { id: req.params.id }
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

router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      res.send(await product.getReviews())
    } else {
      res.status(404).end()
    }
  } catch {
    res.status(500).end()
  }
})

module.exports = router
