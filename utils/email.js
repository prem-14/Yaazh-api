const nodemailer = require('nodemailer')

exports.sendEmail = async (subject, toEmail, template, ccEmail = '') => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSCODE,
    },
  })

  var mailOptions = {
    from: `Yaazh test <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: template,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email Sent: ' + info.response)
    }
  })
}
