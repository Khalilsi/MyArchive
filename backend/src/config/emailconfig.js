const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({

    host: "sandbox.smtp.mailtrap.io",
  
    port: 2525,
  
    auth: {
  
      user: "daa38e1ff057b5",
  
      pass: "f47cc41db0df25"
  
    }
  
  });

module.exports = transporter;