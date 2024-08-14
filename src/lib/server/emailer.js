import { createTransport } from "nodemailer";

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USERNAME = process.env.MAIL_USERNAME;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const MAIL_SENDER = process.env.MAIL_SENDER;

const transportObj = {
  host: MAIL_HOST,
  port: MAIL_PORT,
  tls: true,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
};

// @ts-ignore
const transporter = createTransport(transportObj);

/**
 *
 * @param {string} email
 * @param {string} link
 */
export async function sendRegistrationMail(email, link) {
  const emailText = `
  <h1>Welcome to Favy</h1>
  <a href="${link}" target="_blank">Click on this link to verify</a>
`;

  try {
    const res = await transporter.sendMail({
      from: MAIL_SENDER,
      to: email,
      subject: "Favy Registration",
      html: emailText,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
