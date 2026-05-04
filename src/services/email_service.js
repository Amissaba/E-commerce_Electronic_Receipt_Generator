require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const hbs = require("handlebars");

const readAndSendEmail = async (data, views) => {
  const pathName = path.join(__dirname, `../views/${views}.hbs`);
  const source = fs.readFileSync(pathName, "utf8");
  const template = hbs.compile(source);
  return template(data);
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.G_Mail,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(mailTo, subject, data, views) {
  const html = await readAndSendEmail(data, views);

  const mailOptions = {
    from: process.env.G_Mail,
    to: mailTo,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);

  return info;
}

module.exports = { sendEmail };