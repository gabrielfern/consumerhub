module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      text: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5')
      },
      user: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      product: {
        type: Sequelize.STRING,
        primaryKey: true,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reviews')
  }
}
