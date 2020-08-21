module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
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

  Category.associate = function (models) {
    Category.belongsToMany(models.Product, {
      through: 'ProductCategory',
      foreignKey: 'category'
    })
  }

  return Category
}
