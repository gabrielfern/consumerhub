module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Images', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.BLOB
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Images')
  }
}
