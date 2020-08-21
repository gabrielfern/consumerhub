module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('Categories', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
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
    return queryInterface.dropTable('Categories')
  }
}
