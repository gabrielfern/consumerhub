const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{6}/)

module.exports = (sequelize, DataTypes) => {
  const StagingProduct = sequelize.define('StagingProduct', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
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
    isNewProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    StagingProduct.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  StagingProduct.beforeCreate(async stagingProduct => {
    stagingProduct.id = idGen.gen()
  })

  return StagingProduct
}