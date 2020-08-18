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
    link1: {
      type: DataTypes.STRING
    },
    link2: {
      type: DataTypes.STRING
    },
    link3: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    defaultScope: {
      attributes: {
        exclude: ['image1', 'image2', 'image3', 'image4', 'image5']
      }
    }
  })

  Product.associate = function (models) {
    Product.hasMany(models.Review, {
      foreignKey: 'productId'
    })
  }

  Product.prototype.getReviewsWithVotes = async function (userId) {
    const reviews = await this.getReviews()
    await Promise.all(reviews.map(async review => {
      review.setDataValue('votes', await review.getVoteCounts(userId))
    }))
    return reviews
  }

  return Product
}
