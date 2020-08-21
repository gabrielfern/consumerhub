module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('ProductCategories', {
      productId: {
        type: Sequelize.STRING,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      category: {
        type: Sequelize.STRING,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Categories',
          key: 'name'
        }
      }
    })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('ProductCategories')
  }
}
