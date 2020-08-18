module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      image1: {
        type: Sequelize.BLOB
      },
      image2: {
        type: Sequelize.BLOB
      },
      image3: {
        type: Sequelize.BLOB
      },
      image4: {
        type: Sequelize.BLOB
      },
      image5: {
        type: Sequelize.BLOB
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
