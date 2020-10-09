const express = require('express')
const router = express.Router()
const { Category, ProductCategory, Product, Sequelize } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')

router.post('/', auth('mod'))
router.put('/', auth('mod'))
router.delete('/', auth('mod'))

router.get('/', wrap(async (req, res) => {
  res.send(await Category.findAll({
    order: ['name']
  }))
}))

router.post('/', wrap(async (req, res) => {
  const category = await Category.create({
    name: req.body.name
  })
  res.send(category)
}))

router.put('/', wrap(async (req, res) => {
  const result = await Category.update(req.body, {
    fields: ['name'],
    where: { name: req.query.name }
  })
  if (result[0]) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.delete('/', wrap(async (req, res) => {
  const result = await Category.destroy({
    where: { name: req.query.name }
  })
  if (result) {
    res.end()
  } else {
    res.status(404).end()
  }
}))

router.get('/products', wrap(async (req, res) => {
  if (req.query.name) {
    const category = await Category.findByPk(req.query.name)
    if (category) {
      res.send(await category.getProducts())
    } else {
      res.status(404).end()
    }
  } else {
    let products = await ProductCategory.findAll()
    products = products.map(product => product.productId)
    res.send(await Product.findAll({
      where: {
        id: { [Sequelize.Op.notIn]: products }
      }
    }))
  }
}))

module.exports = router
