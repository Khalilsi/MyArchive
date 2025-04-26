const transporter = require('../config/emailconfig.js');

exports.sendApprovalEmail = async (email, tempPassword) => {
  const mailOptions = {
    from: '"Digital Archive" <no-reply@digitalarchive.com>',
    to: email,
    subject: 'Votre demande a été acceptée',
    html: `
      <h2>Bienvenue sur notre plateforme !</h2>
      <p>Votre demande d'accès a été approuvée.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p>
      <p>Veuillez changer votre mot de passe après la première connexion.</p>
      <a href="http://your-app.com/login">Se connecter</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
};