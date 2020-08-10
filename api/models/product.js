const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{6}/)

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    image1: {
      type: DataTypes.BLOB
    },
    image2: {
      type: DataTypes.BLOB
    },
    image3: {
      type: DataTypes.BLOB
    },
    image4: {
      type: DataTypes.BLOB
    },
    image5: {
      type: DataTypes.BLOB
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  Product.associate = function (models) {
    Product.hasMany(models.Review, {
      foreignKey: 'productId'
    })
  }

  Product.beforeCreate(async product => {
    product.id = idGen.gen()
  })

  Product.prototype.getReviewsWithVotes = async function (userId) {
    const reviews = await this.getReviews()
    await Promise.all(reviews.map(async review => {
      review.setDataValue('votes', await review.getVoteCounts(userId))
    }))
    return reviews
  }

  return Product
}
