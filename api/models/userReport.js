module.exports = (sequelize, DataTypes) => {
  const UserReport = sequelize.define('UserReport', {
    text: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reportedId: {
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

  UserReport.associate = function (models) {
    UserReport.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reporter'
    })
    UserReport.belongsTo(models.User, {
      foreignKey: 'reportedId',
      as: 'reportee'
    })
  }

  return UserReport
}
