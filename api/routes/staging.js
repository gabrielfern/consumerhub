const express = require('express')
const router = express.Router()
const { StagingProduct, Product, Image } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')
const { notifyProductRejected } = require('../services/notifications')

router.all('/', auth('user'))
router.post('/image/:imageNumber', auth('user'))
router.post('/image/:imageNumber', express.raw({
  limit: 5e6, type: '*/*'
}))

router.get('/', wrap(async (req, res) => {
  const where = {}
  if (req.query.id) {
    where.id = req.query.id
  }
  if (req.user.type === 'user') {
    where.userId = req.user.id
  } else if (req.query.userId) {
    where.userId = req.query.userId
  }
  res.send(await StagingProduct.findAll({
    where,
    order: ['createdAt']
  }))
}))

router.post('/', wrap(async (req, res) => {
  if (req.query.id) {
    const product = await Product.findByPk(req.query.id)
    if (product) {
      const stagingProduct = await StagingProduct.create({
        ...product.dataValues,
        userId: req.user.id,
        isNewProduct: false
      })
      res.send({ id: stagingProduct.id })
    } else {
      res.status(404).end()
    }
  } else {
    const stagingProduct = await StagingProduct.create({
      userId: req.user.id,
      isNewProduct: true
    })
    res.send({ id: stagingProduct.id })
  }
}))

router.put('/', wrap(async (req, res) => {
  const result = await StagingProduct.update(req.body, {
    fields: ['name', 'description', 'link1', 'link2', 'link3'],
    where: { id: req.query.id, userId: req.user.id }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/', wrap(async (req, res) => {
  const where = { id: req.query.id, userId: req.user.id }
  if (req.user.type !== 'user' && req.query.userId) {
    where.userId = req.query.userId
  }
  const stagingProduct = await StagingProduct.findOne({ where })
  if (stagingProduct) {
    await Image.delete({
      userId: where.userId, productId: where.id
    })
    if (req.user.id !== where.userId) {
      notifyProductRejected(where.userId, stagingProduct.name)
    }
    await stagingProduct.destroy()
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.post('/image/:imageNumber', wrap(async (req, res) => {
  const imageNumber = `image${req.params.imageNumber}`
  const where = { id: req.query.id, userId: req.user.id }
  const product = await StagingProduct.findOne({ where })
  await Image.delete({ id: product[imageNumber] })

  if (req.body.length) {
    const image = await Image.create({
      userId: where.userId,
      productId: where.id,
      data: req.body
    })
    await StagingProduct.update(
      { [imageNumber]: image.id }, { where }
    )
  } else {
    await StagingProduct.update(
      { [imageNumber]: null }, { where }
    )
  }

  res.end()
}))

module.exports = router
