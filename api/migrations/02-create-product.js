module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      image1: {
        type: Sequelize.STRING
      },
      image2: {
        type: Sequelize.STRING
      },
      image3: {
        type: Sequelize.STRING
      },
      image4: {
        type: Sequelize.STRING
      },
      image5: {
        type: Sequelize.STRING
      },
      link1: {
        type: Sequelize.STRING
      },
      link2: {
        type: Sequelize.STRING
      },
      link3: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products')
  }
}
