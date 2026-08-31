/**
 * Twilio SMS helper.
 *
 * STUB: no `twilio` package is installed and no credentials are set.
 * To enable real SMS:
 *  1. `npm install twilio`
 *  2. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to .env.local
 *  3. Replace the throw below with a real `client.messages.create(...)` call.
 */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;

export function isTwilioConfigured() {
  return Boolean(accountSid && authToken && from);
}

export async function sendSms(to: string, body: string) {
  if (!isTwilioConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[queueless] Twilio not configured — would send SMS to ${to}: ${body}`
      );
    }
    return { skipped: true as const, to, body };
  }

  // const { default: twilio } = await import("twilio");
  // const client = twilio(accountSid, authToken);
  // return client.messages.create({ body, to, from: from! });

  throw new Error(
    "Twilio SDK not installed — add the `twilio` package and implement sendSms in src/lib/twilio.ts"
  );
}

export interface SmsSendResult {
  skipped?: true;
  to: string;
  body: string;
}