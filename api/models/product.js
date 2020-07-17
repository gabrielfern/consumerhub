const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{6}/)

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image1: DataTypes.BLOB,
    image2: DataTypes.BLOB,
    image3: DataTypes.BLOB,
    image4: DataTypes.BLOB,
    image5: DataTypes.BLOB
  }, {})

  Product.beforeCreate(async product => {
    product.id = idGen.gen()
  })

  return Product
}
