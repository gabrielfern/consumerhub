const { Notification, User } = require('../models')

function welcome (userId) {
  Notification.create({
    userId,
    message: 'Bem vindo a plataforma ConsumerHub'
  })
}

function notifyProductAccepted (userId, productId, productName) {
  Notification.create({
    userId,
    message: `O produto "${productName}" que você submeteu foi aceito`,
    url: `/product/${productId}`
  })
}

function notifyProductRejected (userId, productName) {
  Notification.create({
    userId,
    message: `O produto "${productName}" que você submeteu não foi aceito`
  })
}

async function notifyFriendRequest (userId1, userId2) {
  const user = await User.findByPk(userId1)
  if (user) {
    Notification.create({
      userId: userId2,
      message: `O usuário "${user.name}" quer ser seu amigo`,
      url: `/user/${user.id}`
    })
  }
}

async function notifyFriendAccepted (userId1, userId2) {
  const user = await User.findByPk(userId1)
  if (user) {
    Notification.create({
      userId: userId2,
      message: `O usuário "${user.name}" aceitou ser seu amigo`,
      url: `/user/${user.id}`
    })
  }
}

async function notifyFriendRejected (userId1, userId2) {
  const user = await User.findByPk(userId1)
  if (user) {
    Notification.create({
      userId: userId2,
      message: `O usuário "${user.name}" não quer ser seu amigo`,
      url: `/user/${user.id}`
    })
  }
}

module.exports = {
  welcome,
  notifyProductAccepted,
  notifyProductRejected,
  notifyFriendRequest,
  notifyFriendAccepted,
  notifyFriendRejected
}
