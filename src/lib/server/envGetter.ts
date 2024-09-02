export const WEBSITE_URL = process.env.WEBSITE_URL!;

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_SENDER = process.env.MAIL_SENDER;

export function getUserDescLimit() {
  const nLimit = Number(process.env.USER_DESC_LIMIT);
  return Number.isNaN(nLimit) ? 120 : nLimit;
}
