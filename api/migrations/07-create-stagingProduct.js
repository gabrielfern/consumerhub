module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StagingProducts', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
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
      isNewProduct: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    return queryInterface.dropTable('StagingProducts')
  }
}
