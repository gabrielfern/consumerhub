module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
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
    category: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Categories',
        key: 'name'
      }
    }
  }, {
    timestamps: false
  })

  return ProductCategory
}
