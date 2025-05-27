const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({

    host: "sandbox.smtp.mailtrap.io",
  
    port: 2525,
  
    auth: {
  
      user: "daa38e1ff057b5",
  
      pass: "f47cc41db0df25"
  
    }
   
  }); 

  transporter.verify(function(error, success) {
    if (error) {
      console.log('Email service error:', error);
    } else {
      console.log('Email server is ready');
    }
  });

module.exports = transporter;