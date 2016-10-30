var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('postmaster@sandboxf742a882f59849789ce535113b0e4a0b.mailgun.org>');

module.exports = {
  send: function(text, email){
    var mailOptions = {
      from: 'no-reply@pasturetopantry.com',
      to: email,
      subject: 'Your order from Pasture to Pantry',
      text: text
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) return console.error(error);
      console.log('Message sent!' + info.response);
    });
  }
}

module.exports.send("test email", "lisaveras@gmail.com");
