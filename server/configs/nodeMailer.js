import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER, // generated user
    pass: process.env.SMTP_PASS, // generated password
  },
});

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    subject,
    html: body,
  });
  return response;
};

export default sendEmail;
