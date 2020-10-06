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
      type: DataTypes.STRING,
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
