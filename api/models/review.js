const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{10}/)

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5'),
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId']
      }
    ]
  })

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    Review.belongsTo(models.Product, {
      foreignKey: 'productId'
    })
  }

  Review.beforeCreate(async review => {
    review.id = idGen.gen()
  })

  return Review
}
