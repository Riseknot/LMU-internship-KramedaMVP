import { Resend } from "resend";

type VerificationEmailInput = {
  to: string;
  firstname: string;
  code: string;
  expiresAt: number;
};

let cachedResendClient: Resend | null = null;

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  return {
    apiKey,
    from,
    isConfigured: Boolean(apiKey),
  };
}

function getResendClient() {
  if (cachedResendClient) {
    return cachedResendClient;
  }

  const config = getResendConfig();
  if (!config.isConfigured || !config.apiKey) {
    return null;
  }

  cachedResendClient = new Resend(config.apiKey);
  return cachedResendClient;
}

export async function sendVerificationCodeEmail({ to, firstname, code, expiresAt }: VerificationEmailInput) {
  const config = getResendConfig();
  const appName = process.env.APP_NAME ?? "CareConnect";

  if (!config.isConfigured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_NOT_CONFIGURED");
    }

    console.info(`[REGISTRATION][DEV] Resend not configured. Verification code for ${to}: ${code}`);
    return { sent: false as const, mode: "development" as const };
  }

  const resend = getResendClient();
  if (!resend) {
    throw new Error("RESEND_CLIENT_UNAVAILABLE");
  }

  const expiresTime = new Date(expiresAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const response = await resend.emails.send({
    from: config.from,
    to,
    subject: `${appName} - E-Mail bestätigen`,
    text: `Hallo ${firstname},\n\nIhr Bestaetigungscode lautet: ${code}\nDer Code ist gueltig bis ${expiresTime}.\n\nWenn Sie diese Registrierung nicht gestartet haben, ignorieren Sie bitte diese E-Mail.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">E-Mail-Bestaetigung</h2>
        <p>Hallo ${firstname},</p>
        <p>bitte bestaetigen Sie Ihre Registrierung mit diesem 6-stelligen Code:</p>
        <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; margin: 18px 0; color: #1d4ed8;">${code}</div>
        <p>Der Code ist gueltig bis <strong>${expiresTime}</strong>.</p>
        <p>Wenn Sie diese Registrierung nicht gestartet haben, koennen Sie diese E-Mail ignorieren.</p>
      </div>
    `,
  });

  if (response.error) {
    throw new Error(`RESEND_SEND_FAILED:${response.error.message}`);
  }

  return { sent: true as const, mode: "resend" as const };
}
