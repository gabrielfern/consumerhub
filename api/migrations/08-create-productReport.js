module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('ProductReports', {
      text: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('ProductReports')
  }
}
