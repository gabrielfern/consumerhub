const RandExp = require('randexp')
const idGen = new RandExp(/[a-zA-Z0-9]{10}/)

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING(500)
    },
    rating: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5'),
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.STRING,
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
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['userId', 'productId']
    }]
  })

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    Review.belongsTo(models.Product, {
      foreignKey: 'productId'
    })
    Review.hasMany(models.ReviewVote, {
      foreignKey: 'reviewId',
      as: 'votes'
    })
    Review.hasMany(models.ReviewReport, {
      foreignKey: 'reviewId',
      as: 'reports'
    })
  }

  Review.beforeCreate(async review => {
    review.id = idGen.gen()
  })

  Review.prototype.getVoteCounts = async function (userId) {
    const votes = await this.getVotes({
      attributes: ['type', 'userId'], raw: true
    })

    let voted = false
    let upvotes = 0
    let downvotes = 0
    for (const vote of votes) {
      if (vote.userId === userId) {
        voted = vote.type
      }
      if (vote.type === 'upvote') {
        upvotes++
      } else {
        downvotes++
      }
    }

    return { voted, upvotes, downvotes }
  }

  return Review
}
