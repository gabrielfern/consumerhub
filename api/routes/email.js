const router = require('express').Router()
const nodemailer = require('nodemailer')
const email = process.env.GMAIL_EMAIL ||
  require('../env.json').gmailAuth.email
const pass = process.env.GMAIL_PASS ||
  require('../env.json').gmailAuth.pass
const auth = process.env.AUTH ||
  require('../env.json').auth

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email, pass
  }
})

router.post('/', async (req, res) => {
  if (auth === req.body.auth) {
    try {
      await transporter.sendMail({
        from: `"Consumerhub" <${email}>`,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
      })
      res.end()
    } catch {
      res.status(500).end()
    }
  } else {
    res.status(401).end()
  }
})

module.exports = router
