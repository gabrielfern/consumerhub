const express = require('express')
const router = express.Router()
const { Product, StagingProduct } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.post('/', auth('mod'))
router.put('/:id', auth('mod'))
router.delete('/:id', auth('mod'))
router.get('/:id/reviews', auth())

router.get('/', wrap(async (req, res) => {
  res.send(await Product.findAll())
}))

router.post('/', wrap(async (req, res) => {
  const stagingProduct = await StagingProduct.unscoped().findOne({
    where: { id: req.query.id, userId: req.query.userId }
  })
  if (stagingProduct) {
    const product = await Product.create(stagingProduct.dataValues)
    await stagingProduct.destroy()
    res.send({ id: product.id })
  } else {
    res.status(404).end()
  }
}))

router.get('/:id', wrap(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.status(404).end()
  }
}))

router.put('/:id', wrap(async (req, res) => {
  const stagingProduct = await StagingProduct.unscoped().findOne({
    where: { id: req.params.id, userId: req.query.userId }
  })
  const product = await Product.findByPk(req.params.id)
  if (stagingProduct && product) {
    const values = {}
    for (const attr in product.rawAttributes) {
      if (stagingProduct[attr] !== null) {
        values[attr] = stagingProduct[attr]
      }
    }
    await product.update(values)
    await stagingProduct.destroy()
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/:id', wrap(async (req, res) => {
  const result = await Product.destroy({
    where: { id: req.params.id }
  })
  await StagingProduct.destroy({
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
  if (product && product[imageNumber] &&
    product[imageNumber].length) {
    res.set('Content-Type', 'image')
    res.send(product[imageNumber])
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
