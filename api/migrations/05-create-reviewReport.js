module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('ReviewReports', {
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
      reviewId: {
        type: Sequelize.STRING,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Reviews',
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
    return queryInterface.dropTable('ReviewReports')
  }
}
