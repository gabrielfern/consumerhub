const express = require('express')
const router = express.Router()
const { StagingProduct, Product } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.all('/', auth('user'))

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
  const stagingProducts = await StagingProduct.findAll({
    attributes: [
      'id', 'userId', 'isNewProduct', 'name',
      'description', 'createdAt', 'updatedAt'
    ],
    where
  })
  res.send(stagingProducts)
}))

router.post('/', wrap(async (req, res) => {
  if (req.body.id) {
    const product = await Product.findByPk(req.body.id, {
      attributes: []
    })
    if (product) {
      const stagingProduct = await StagingProduct.create({
        id: req.body.id,
        userId: req.user.id,
        isNewProduct: false,
        name: req.body.name,
        description: req.body.description
      })
      res.send(stagingProduct)
    } else {
      res.status(404).end()
    }
  } else {
    const stagingProduct = await StagingProduct.create({
      userId: req.user.id,
      isNewProduct: true,
      name: req.body.name,
      description: req.body.description
    })
    res.send(stagingProduct)
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

module.exports = router
