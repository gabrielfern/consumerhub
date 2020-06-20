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
    res.send(user.image)
  } catch {
    res.status(500).end()
  }
})

router.post('/:id/image', (req, res) => {
  const sizeLimit = 5e6
  let image = Buffer.from([])
  if (sizeLimit < req.headers['content-length']) {
    res.status(413).end()
  }

  req.on('data', data => {
    image = Buffer.concat([image, data])
  })

  req.on('end', async () => {
    try {
      if (!req.socket.destroyed) {
        await User.update({ image }, { where: { id: req.params.id } })
        res.end()
      }
    } catch {
      res.status(500).end()
    }
  })
})

module.exports = router
