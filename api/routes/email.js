const router = require('express').Router()
const nodemailer = require('nodemailer')
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

router.post('/', auth('admin'))

router.post('/', wrap(async (req, res) => {
  await transporter.sendMail({
    from: `"Consumerhub" <${email}>`,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  })
  res.end()
}))

module.exports = router
