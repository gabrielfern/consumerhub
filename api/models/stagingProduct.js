module.exports = (sequelize, DataTypes) => {
  const StagingProduct = sequelize.define('StagingProduct', {
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

  StagingProduct.associate = function (models) {
    StagingProduct.belongsTo(models.Product, {
      foreignKey: 'productId'
    })
    StagingProduct.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  return StagingProduct
}
