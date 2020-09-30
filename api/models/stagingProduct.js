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
