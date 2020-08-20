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
    User.hasMany(models.ReviewReport, {
      foreignKey: 'userId'
    })
    User.hasMany(models.Friendship, {
      foreignKey: 'userId1',
      as: 'friendships1'
    })
    User.hasMany(models.Friendship, {
      foreignKey: 'userId2',
      as: 'friendships2'
    })
    User.hasMany(models.ProductReport, {
      foreignKey: 'userId'
    })
    User.hasMany(models.UserReport, {
      foreignKey: 'userId',
      as: 'reporter'
    })
    User.hasMany(models.UserReport, {
      foreignKey: 'reportedId',
      as: 'reportee'
    })
  }

  User.beforeCreate(async user => {
    user.id = idGen.gen()
    if (user.password !== undefined) {
      const hash = await bcrypt.hash(user.password, saltRounds)
      user.password = hash
    }
  })

  User.beforeUpdate(async user => {
    if (user.changed('password')) {
      const hash = await bcrypt.hash(user.password, saltRounds)
      user.password = hash
    }
  })

  User.user = 0
  User.mod = 1
  User.admin = 2

  User.getById = function (id) {
    return User.findByPk(id, {
      attributes: { exclude: ['image'] }
    })
  }

  User.getByEmail = function (email) {
    return User.findOne({
      attributes: { exclude: ['image'] },
      where: { email }
    })
  }

  User.createFromObj = async function (obj) {
    const user = await User.create({
      name: obj.name,
      email: obj.email,
      password: obj.password
    })
    const json = user.toJSON()
    delete json.password
    delete json.image
    return json
  }

  User.prototype.updateAndInc = async function (values) {
    values.tokenVersion = sequelize.literal(
      '"tokenVersion" + 1'
    )
    await this.update(values, {
      fields: ['name', 'email', 'password', 'tokenVersion']
    })
    await this.reload({
      attributes: ['tokenVersion']
    })
  }

  User.prototype.getFriendships = async function () {
    return [
      ...await this.getFriendships1(), ...await this.getFriendships2()
    ]
  }

  User.prototype.getFriends = async function () {
    const friends = []
    const friendships = await this.getFriendships()

    for (const friendship of friendships) {
      if (this.id !== friendship.userId1 && friendship.accepted) {
        friends.push(await friendship.getUser1({
          attributes: ['id', 'name', 'email'],
          raw: true
        }))
      } else if (friendship.accepted) {
        friends.push(await friendship.getUser2({
          attributes: ['id', 'name', 'email'],
          raw: true
        }))
      }
    }

    return friends
  }

  User.prototype.getFriendshipWith = async function (userId) {
    const friendships = await this.getFriendships()
    for (const friendship of friendships) {
      if (friendship.userId1 === userId || friendship.userId2 === userId) {
        return friendship
      }
    }
  }

  return User
}
