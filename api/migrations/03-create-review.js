module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('Reviews', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        text: {
          type: Sequelize.STRING
        },
        rating: {
          type: Sequelize.ENUM('1', '2', '3', '4', '5'),
          allowNull: false
        },
        userId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        productId: {
          type: Sequelize.STRING,
          allowNull: false,
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
      }, { transaction })
      await queryInterface.addIndex(
        'Reviews',
        ['userId', 'productId'],
        {
          unique: true,
          transaction
        }
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('Reviews', { transaction })
      await transaction.commit()
    } catch {
      await transaction.rollback()
    }
  }
}
