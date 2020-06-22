const router = require('express').Router()
const { User } = require('../models')

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body, {
      fields: ['name', 'email', 'password']
    })
    delete user.dataValues.password
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email'], where: { id: req.params.id }
    })
    res.send(user)
  } catch {
    res.status(500).end()
  }
})

router.get('/:id/image', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['image'], where: { id: req.params.id }
    })
    res.set('Content-Type', 'image')
    res.send(user.image)
  } catch {
    res.status(500).end()
  }
})

router.post('/:id/image', (req, res) => {
  const sizeLimit = 5e6
  let exceededLimit = false
  let image = Buffer.from([])

  req.on('data', data => {
    if (image.length + data.length <= sizeLimit) {
      image = Buffer.concat([image, data])
    } else if (!exceededLimit) {
      exceededLimit = true
    }
  })

  req.on('end', async () => {
    try {
      if (!exceededLimit) {
        await User.update({ image }, { where: { id: req.params.id } })
        res.end()
      } else {
        res.status(413).end()
      }
    } catch {
      res.status(500).end()
    }
  })
})

module.exports = router
