const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.BLOB
  }, {})

  User.beforeCreate(async user => {
    if (user.password !== undefined) {
      const hash = await bcrypt.hash(user.password, saltRounds)
      user.password = hash
    }
  })

  return User
}
