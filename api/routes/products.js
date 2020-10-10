const express = require('express')
const router = express.Router()
const { Product, StagingProduct, Image } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')
const { notifyProductAccepted } = require('../services/notifications')

router.post('/', auth('mod'))
router.put('/:id', auth('mod'))
router.delete('/:id', auth('mod'))
router.get('/:id/reviews', auth())
router.post('/:id/categories', auth('mod'))
router.delete('/:id/categories', auth('mod'))

router.get('/', wrap(async (req, res) => {
  res.send(await Product.findAll({
    include: {
      association: 'Categories'
    }
  }))
}))

router.post('/', wrap(async (req, res) => {
  const stagingProduct = await StagingProduct.findOne({
    where: { id: req.query.id, userId: req.query.userId }
  })
  if (stagingProduct) {
    const product = await Product.create(stagingProduct.dataValues)
    await Image.clearUsers(req.query.userId, req.query.id)
    if (req.user.id !== req.query.userId) {
      notifyProductAccepted(
        stagingProduct.userId, stagingProduct.id, stagingProduct.name
      )
    }
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
  const stagingProduct = await StagingProduct.findOne({
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
    await Image.clearUsers(req.query.userId, req.params.id)
    if (req.user.id !== req.query.userId) {
      notifyProductAccepted(
        stagingProduct.userId, product.id, product.name
      )
    }
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
  await Image.delete({ productId: req.params.id })
  await StagingProduct.destroy({
    where: { id: req.params.id }
  })
  if (result) {
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

router.get('/:id/categories', wrap(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  res.send(await product.getCategories({
    order: ['name']
  }))
}))

router.post('/:id/categories', wrap(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  await product.addCategory(req.body.name)
  res.end()
}))

router.delete('/:id/categories', wrap(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  await product.removeCategory(req.body.name)
  res.end()
}))

module.exports = router
