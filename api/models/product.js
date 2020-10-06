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
      type: DataTypes.STRING
    },
    image2: {
      type: DataTypes.STRING
    },
    image3: {
      type: DataTypes.STRING
    },
    image4: {
      type: DataTypes.STRING
    },
    image5: {
      type: DataTypes.STRING
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
    const reviews = await this.getReviews({
      include: [{
        association: 'User',
        attributes: ['name', 'image']
      }]
    })
    await Promise.all(reviews.map(async review => {
      review.setDataValue('votes', await review.getVoteCounts(userId))
    }))
    return reviews
  }

  return Product
}
