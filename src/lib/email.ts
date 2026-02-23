import { createTransport } from "nodemailer";
import { getEmailSettings } from "./queries/settings";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface EmailError extends Error {
  code?: string;
  statusCode?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [5000, 15000, 45000]; // 5s, 15s, 45s

function isRetriableError(error: EmailError): boolean {
  const retriableCodes = [
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "EAI_AGAIN",
  ];
  const retriableStatus = [429, 500, 502, 503, 504];
  return (
    retriableCodes.includes(error.code || "") ||
    retriableStatus.includes(error.statusCode || 0)
  );
}

function logEmailAttempt(
  level: "info" | "warn" | "error",
  message: string,
  details: Record<string, unknown>
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "email",
    environment: process.env.NODE_ENV || "development",
    ...details,
  };
  console[level](JSON.stringify(logEntry));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmailWithRetry(
  sendFn: () => Promise<void>,
  context: Record<string, unknown>,
  attempt = 1
): Promise<void> {
  try {
    await sendFn();
    logEmailAttempt("info", "Email sent successfully", { ...context, attempt });
  } catch (error) {
    const emailError = error as EmailError;
    const errorDetails = {
      ...context,
      attempt,
      errorMessage: emailError.message,
      errorCode: emailError.code,
      errorStatus: emailError.statusCode,
    };

    if (attempt < MAX_RETRIES && isRetriableError(emailError)) {
      const delay = RETRY_DELAYS[attempt - 1];
      logEmailAttempt(
        "warn",
        `Email send failed, retrying in ${delay}ms`,
        errorDetails
      );
      await sleep(delay);
      return sendEmailWithRetry(sendFn, context, attempt + 1);
    } else {
      logEmailAttempt("error", "Email send failed permanently", errorDetails);
      throw emailError;
    }
  }
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const settings = await getEmailSettings();

  if (!settings) {
    const error = new Error("Email settings not configured");
    logEmailAttempt("error", "Email settings not configured", {
      recipient: params.to,
      subject: params.subject,
    });
    throw error;
  }

  const { to, subject, html, text } = params;

  if (settings.provider === "smtp") {
    if (
      !settings.smtp_host ||
      !settings.smtp_port ||
      !settings.smtp_username ||
      !settings.smtp_password
    ) {
      throw new Error("SMTP settings incomplete");
    }

    const context = {
      provider: "smtp",
      recipient: to,
      subject,
      smtpHost: settings.smtp_host,
      smtpPort: settings.smtp_port,
    };

    await sendEmailWithRetry(async () => {
      const transporter = createTransport({
        host: settings.smtp_host!,
        port: parseInt(settings.smtp_port!, 10),
        secure: settings.smtp_use_tls === "true",
        auth: {
          user: settings.smtp_username!,
          pass: settings.smtp_password!,
        },
      });

      await transporter.sendMail({
        from: settings.from_email || settings.smtp_username,
        to,
        subject,
        html,
        text,
      });

      await transporter.close();
    }, context);
  } else if (settings.provider === "sendgrid") {
    if (!settings.sendgrid_api_key) {
      throw new Error("SendGrid API key not configured");
    }

    const context = { provider: "sendgrid", recipient: to, subject };

    await sendEmailWithRetry(async () => {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.sendgrid_api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: settings.from_email || "noreply@lawnies.com.au" },
          subject,
          content: [
            { type: "text/plain", value: text },
            { type: "text/html", value: html },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(
          `SendGrid error: ${response.status} - ${errorText}`
        ) as EmailError;
        err.statusCode = response.status;
        throw err;
      }
    }, context);
  } else {
    throw new Error(`Unsupported email provider: ${settings.provider}`);
  }
}
