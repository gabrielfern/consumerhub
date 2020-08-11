module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define('Friendship', {
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    userId1: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    userId2: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  })

  Friendship.associate = function (models) {
    Friendship.belongsTo(models.User, {
      foreignKey: 'userId1',
      as: 'user1'
    })
    Friendship.belongsTo(models.User, {
      foreignKey: 'userId2',
      as: 'user2'
    })
  }

  return Friendship
}
