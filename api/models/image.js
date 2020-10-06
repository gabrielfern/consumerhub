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

  return Image
}
