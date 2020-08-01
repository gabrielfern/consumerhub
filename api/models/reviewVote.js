module.exports = (sequelize, DataTypes) => {
  const ReviewVote = sequelize.define('ReviewVote', {
    type: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false
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
    reviewId: {
      type: DataTypes.STRING,
      primaryKey: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Reviews',
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

  ReviewVote.associate = function (models) {
    ReviewVote.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    ReviewVote.belongsTo(models.Review, {
      foreignKey: 'reviewId'
    })
  }

  return ReviewVote
}
