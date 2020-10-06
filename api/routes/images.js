const router = require('express').Router()
const { Image } = require('../models')
const { wrap } = require('../utils/errorHandlers')

router.get('/:id', wrap(async (req, res) => {
  const image = await Image.findByPk(req.params.id)
  if (image && image.data && image.data.length) {
    res.set('Content-Type', 'image')
    res.send(image.data)
  } else {
    res.status(404).end()
  }
}))

module.exports = router
