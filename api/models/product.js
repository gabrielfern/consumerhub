module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.STRING(1000)
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
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    link2: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    link3: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
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
    Product.hasMany(models.ProductReport, {
      foreignKey: 'productId'
    })
    Product.belongsToMany(models.Category, {
      through: 'ProductCategory',
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
