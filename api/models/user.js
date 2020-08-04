const bcrypt = require('bcrypt')
const RandExp = require('randexp')
const saltRounds = 10
const idGen = new RandExp(/[a-zA-Z0-9]{8}/)

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('user', 'mod', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.BLOB
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  User.associate = function (models) {
    User.hasMany(models.Review, {
      foreignKey: 'userId'
    })
    User.hasMany(models.ReviewVote, {
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

  User.beforeBulkUpdate(async options => {
    const password = options.attributes.password
    if (password !== undefined) {
      const hash = await bcrypt.hash(password, saltRounds)
      options.attributes.password = hash
    }
  })

  return User
}
