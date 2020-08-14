const express = require('express')
const router = express.Router()
const { StagingProduct } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.get('/', auth('mod'))
router.all('/', auth('user'))

router.get('/', wrap(async (req, res) => {
  const stagingProducts = await StagingProduct.findAll({
    attributes: [
      'id', 'userId', 'isNewProduct', 'name',
      'description', 'createdAt', 'updatedAt'
    ]
  })
  res.send(stagingProducts)
}))

router.post('/', wrap(async (req, res) => {
  const stagingProduct = await StagingProduct.create({
    userId: req.user.id,
    isNewProduct: true,
    name: req.body.name,
    description: req.body.description
  })
  res.send({
    id: stagingProduct.id,
    name: stagingProduct.name,
    description: stagingProduct.description
  })
}))

module.exports = router
