const express = require('express')
const router = express.Router()
const { Product } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.get('/:id/reviews', auth())

router.post('/:id/image/:imageNumber', express.raw({
  limit: 5e6, type: '*/*'
}))

router.get('/', wrap(async (req, res) => {
  const products = await Product.findAll({
    attributes: [
      'id', 'name', 'description', 'createdAt', 'updatedAt'
    ]
  })
  res.send(products)
}))

router.post('/', wrap(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description
  })
  res.send({
    id: product.id,
    name: product.name,
    description: product.description
  })
}))

router.get('/:id', wrap(async (req, res) => {
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
}))

router.put('/:id', wrap(async (req, res) => {
  const result = await Product.update(req.body, {
    fields: ['name', 'description'],
    where: { id: req.params.id }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/:id', wrap(async (req, res) => {
  const result = await Product.destroy({
    where: { id: req.params.id }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/:id/image/:imageNumber', wrap(async (req, res) => {
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
}))

router.post('/:id/image/:imageNumber', wrap(async (req, res) => {
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
}))

router.get('/:id/reviews', wrap(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  if (product) {
    const userId = req.user && req.user.id
    res.send(await product.getReviewsWithVotes(userId))
  } else {
    res.status(404).end()
  }
}))

module.exports = router
