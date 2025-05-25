const transporter = require("../config/emailconfig.js");

exports.sendApprovalEmail = async (email, tempPassword , username) => {
  if (!email || !tempPassword) {
    throw new Error("Missing required parameters: email, tempPassword");
  }

  const mailOptions = {
    from: '"Digital Archive" <no-reply@digitalarchive.com>',
    to: email,
    subject: "Votre demande a été acceptée",
    html: `
          <!DOCTYPE HTML>
          <html>
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f9f9f9; -webkit-font-smoothing: antialiased; font-family: 'Lato', sans-serif;">
            <div style="width: 100%; box-sizing: border-box; background-color: #f9f9f9; padding: 10px;">
              <div style="margin: 0 auto; max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 0px 15px rgba(0,0,0,0.1); overflow: hidden;">
                <!-- Header -->
                <div style="padding: 30px 15px; background-color: #161a39; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: min(24px, 5vw); word-wrap: break-word;">
                    Bienvenue chez Digital Archive
                  </h1>
                </div>

                <!-- Content -->
                <div style="padding: 20px; font-family: 'Lato', sans-serif;">
                  <p style="margin-bottom: 20px; color: #666666; font-size: min(16px, 3vw); line-height: 1.5;">
                    Nous sommes ravis de vous informer que votre demande a été acceptée !
                  </p>
                  
                  <p style="margin-bottom: 20px; color: #666666; font-size: min(16px, 3vw); line-height: 1.5;">
                    Votre compte a été créé avec succès. Voici vos identifiants de connexion :
                  </p>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; word-break: break-all;">
                    <p style="margin: 0 0 10px 0; font-size: min(16px, 3vw);"><strong style="color: #161a39;">Email:</strong> ${email}</p>
                    <p style="margin: 0; font-size: min(16px, 3vw);"><strong style="color: #161a39;">Mot de passe temporaire:</strong> ${tempPassword}</p>
                  </div>

                  <div style="text-align: center; margin: 25px 0;">
                    <a href="http://localhost:3000/login" 
                      style="display: inline-block; width: 100%; max-width: 200px; padding: 12px 15px; 
                              background-color: #161a39; color: #ffffff; text-decoration: none; 
                              border-radius: 6px; font-weight: 700; text-align: center;
                              box-sizing: border-box;">
                      SE CONNECTER
                    </a>
                  </div>
                  
                  <div style="text-align: center;">
                    <p style="color: #e74c3c; font-size: min(14px, 2.5vw); margin: 0;">
                      Pour des raisons de sécurité, veuillez changer votre mot de passe lors de votre première connexion.
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #161a39; padding: 20px 15px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #ffffff; font-size: min(14px, 2.5vw);">
                    © 2024 Digital Archive. Tous droits réservés.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: min(13px, 2.5vw);">
                    Si vous avez des questions, n'hésitez pas à nous contacter.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};
