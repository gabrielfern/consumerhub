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
          type: Sequelize.STRING(500)
        },
        rating: {
          type: Sequelize.ENUM('1', '2', '3', '4', '5'),
          allowNull: false
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
        productId: {
          type: Sequelize.STRING,
          allowNull: false,
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
      }, { transaction })

      await queryInterface.addIndex('Reviews',
        ['userId', 'productId'],
        { unique: true, transaction }
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Reviews')
  }
}
