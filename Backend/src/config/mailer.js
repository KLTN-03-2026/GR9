import nodemailer from "nodemailer";

let transporterInstance = null;

const buildMailerError = (message, status = 500, errorCode = "MAILER_ERROR") => {
  const err = new Error(message);
  err.status = status;
  err.errorCode = errorCode;
  return err;
};

const parseSmtpPort = () => {
  const parsed = Number(process.env.SMTP_PORT || 587);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 587;
  }

  return parsed;
};

const parseSecureOption = () => {
  return String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
};

const parseSmtpPassword = () => {
  return String(process.env.SMTP_PASS || "").replace(/\s+/g, "");
};

const ensureMailerConfig = () => {
  const requiredKeys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missingKeys = requiredKeys.filter((key) => !String(process.env[key] || "").trim());

  if (missingKeys.length) {
    throw buildMailerError(
      `Mail configuration is missing: ${missingKeys.join(", ")}`,
      500,
      "MAIL_CONFIG_MISSING"
    );
  }
};

export const getMailerTransporter = () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  ensureMailerConfig();
  transporterInstance = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseSmtpPort(),
    secure: parseSecureOption(),
    auth: {
      user: process.env.SMTP_USER,
      pass: parseSmtpPassword(),
    },
  });

  return transporterInstance;
};

export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = getMailerTransporter();
  const rawFrom = String(process.env.MAIL_FROM || "").trim();
  const from = rawFrom.includes("@")
    ? rawFrom
    : rawFrom
      ? `"${rawFrom}" <${process.env.SMTP_USER}>`
      : process.env.SMTP_USER;

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
};

