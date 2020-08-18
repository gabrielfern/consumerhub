const express = require('express')
const router = express.Router()
const { StagingProduct, Product } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.all('/', auth('user'))
router.all('/image/:imageNumber', auth('user'))
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
  res.send(await StagingProduct.findAll({ where }))
}))

router.post('/', wrap(async (req, res) => {
  if (req.query.id) {
    const product = await Product.findByPk(req.query.id, {
      attributes: []
    })
    if (product) {
      const stagingProduct = await StagingProduct.create({
        id: req.query.id,
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
    fields: ['name', 'description'],
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
  const result = await StagingProduct.destroy({ where })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/image/:imageNumber', wrap(async (req, res) => {
  const where = { id: req.query.id, userId: req.user.id }
  if (req.user.type !== 'user' && req.query.userId) {
    where.userId = req.query.userId
  }
  const imageNumber = `image${req.params.imageNumber}`
  const stagingProduct = await StagingProduct.findOne({
    attributes: [imageNumber],
    where
  })
  if (stagingProduct && stagingProduct[imageNumber] &&
    stagingProduct[imageNumber].length) {
    res.set('Content-Type', 'image')
    res.send(stagingProduct[imageNumber])
  } else {
    res.status(404).end()
  }
}))

router.post('/image/:imageNumber', wrap(async (req, res) => {
  const imageNumber = `image${req.params.imageNumber}`
  const result = await StagingProduct.update({
    [imageNumber]: req.body
  }, {
    where: { id: req.query.id, userId: req.user.id }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

module.exports = router
