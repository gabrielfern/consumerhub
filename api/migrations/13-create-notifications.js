module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      message: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      url: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Notifications')
  }
}
