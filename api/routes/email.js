const router = require('express').Router()
const nodemailer = require('nodemailer')
const { User } = require('../models')
const { auth } = require('./auth')
const { wrap } = require('../utils/errorHandlers')
const email = process.env.GMAIL_EMAIL ||
  require('../env.json').gmailAuth.email
const pass = process.env.GMAIL_PASS ||
  require('../env.json').gmailAuth.pass

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email, pass
  }
})

function sendEmail (to, subject, html) {
  transporter.sendMail({
    from: `"Consumerhub" <${email}>`, to, subject, html
  })
}

router.post('/', auth('admin'))

router.post('/', wrap(async (req, res) => {
  if (!req.body.to) {
    const users = await User.findAll({
      attributes: ['email'],
      raw: true
    })

    // eslint-disable-next-line
    function sendToAll () {
      const user = users.pop()
      if (user) {
        sendEmail(user.email, req.body.subject, req.body.html)
        setTimeout(sendToAll, 5000)
      }
    }

    sendToAll()
  } else {
    sendEmail(req.body.to, req.body.subject, req.body.html)
  }

  res.end()
}))

module.exports = router
