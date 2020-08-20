module.exports = (sequelize, DataTypes) => {
  const ProductReport = sequelize.define('ProductReport', {
    text: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
  })

  ProductReport.associate = function (models) {
    ProductReport.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    ProductReport.belongsTo(models.Product, {
      foreignKey: 'productId'
    })
  }

  return ProductReport
}
