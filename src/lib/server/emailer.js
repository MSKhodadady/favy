import { createTransport } from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_SENDER,
  MAIL_USERNAME,
} from "./envGetter";

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

  await transporter.sendMail({
    from: MAIL_SENDER,
    to: email,
    subject: "Favy Registration",
    html: emailText,
  });
}
