module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    text: DataTypes.STRING,
    rating: DataTypes.ENUM('1', '2', '3', '4', '5'),
    user: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    product: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'Products',
        key: 'id'
      }
    }
  }, {})

  Review.associate = function (models) {
    Review.hasOne(models.User, {
      foreignKey: 'user'
    })
    Review.hasOne(models.Product, {
      foreignKey: 'product'
    })
  }

  return Review
}
