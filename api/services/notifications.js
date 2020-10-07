const { Notification } = require('../models')

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

module.exports = { notifyProductAccepted, notifyProductRejected }
