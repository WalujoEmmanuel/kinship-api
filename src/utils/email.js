const nodemailer = require("nodemailer");
const config = require("../config");

const sendEmail = async (fromEmail, toEmail, subject, body) => {
  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: config.mailer.user, 
  //       pass: config.mailer.pass,
  //     }
  //   });

  //   const mailOptions = {
  //     from: fromEmail,
  //     to: toEmail,
  //     subject:  subject,
  //     html: body
  //   };   

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: config.mailer.user, // "walujoemmanuel@gmail.com", // 'ainnoptests@gmail.com',
      pass: config.mailer.pass, // "Edmon0690", // 'tests555'
    },
  });

  mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: body,
  };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Message sent: " + info.response);
  //   }
  // });

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
