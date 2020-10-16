const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{12}/)

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING
    },
    productId: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.BLOB
    }
  }, {
    timestamps: false
  })

  Image.beforeCreate(async image => {
    image.id = idGen.gen()
  })

  Image.delete = (where) => {
    return Image.destroy({ where })
  }

  Image.clearUsers = (userId, productId) => {
    return Image.update({ userId: null }, {
      where: { userId, productId }
    })
  }

  Image.cloneImages = async (product, userId, transaction) => {
    const images = {}
    const promises = []

    for (let i = 1; i <= 5; i++) {
      promises.push((async () => {
        const image = await Image.findByPk(product['image' + i])
        if (image) {
          images['image' + i] = (await Image.create({
            userId, productId: product.id, data: image.data
          }, { transaction })).id
        }
      })())
    }

    await Promise.all(promises)
    return images
  }

  Image.deleteImages = (product) => {
    for (let i = 1; i <= 5; i++) {
      if (product['image' + i]) {
        Image.destroy({ where: { id: product['image' + i] } })
      }
    }
  }

  return Image
}
