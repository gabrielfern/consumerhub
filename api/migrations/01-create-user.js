module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      type: {
        type: Sequelize.ENUM('user', 'mod', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB
      },
      tokenVersion: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isGoogleUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    return queryInterface.dropTable('Users')
  }
}
