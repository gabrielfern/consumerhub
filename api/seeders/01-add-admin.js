const bcrypt = require('bcrypt')
const RandExp = require('randexp')
const saltRounds = 10
const idGen = new RandExp(/[a-zA-Z0-9]{8}/)
const adminEmail = process.env.ADMIN_EMAIL ||
  require('../env.json').adminEmail
const adminPassword = process.env.ADMIN_PASSWORD ||
  require('../env.json').adminPassword

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: idGen.gen(),
      type: 'admin',
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, saltRounds),
      createdAt: new Date(),
      updatedAt: new Date()
    }]).catch(() => {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      email: adminEmail
    })
  }
}
