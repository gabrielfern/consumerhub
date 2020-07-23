const bcrypt = require('bcrypt')
const RandExp = require('randexp')
const saltRounds = 10
const idGen = new RandExp(/[a-zA-Z0-9]{8}/)

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.BLOB
  }, {})

  User.associate = function (models) {
    User.hasMany(models.Review, {
      foreignKey: 'userId'
    })
  }

  User.beforeCreate(async user => {
    user.id = idGen.gen()
    if (user.password !== undefined) {
      const hash = await bcrypt.hash(user.password, saltRounds)
      user.password = hash
    }
  })

  return User
}
