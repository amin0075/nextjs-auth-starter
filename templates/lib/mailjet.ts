import { env } from "../env.mjs";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class MailjetService {
  private apiKey: string;
  private secretKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = env.MAILJET_API_KEY;
    this.secretKey = env.MAILJET_SECRET_KEY;
    this.fromEmail = env.MAILJET_FROM_EMAIL;
    this.fromName = env.MAILJET_FROM_NAME;

    if (!this.apiKey || !this.secretKey || !this.fromEmail) {
      throw new Error(
        "Mailjet configuration is missing. Please set MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_FROM_EMAIL in your environment variables."
      );
    }
  }

  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    try {
      if (!to || to.trim() === "") {
        console.error("Empty email address provided to sendEmail");
        return false;
      }

      const response = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.apiKey}:${this.secretKey}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          Messages: [
            {
              From: {
                Email: this.fromEmail,
                Name: this.fromName,
              },
              To: [
                {
                  Email: to,
                },
              ],
              Subject: subject,
              TextPart: text || "",
              HTMLPart: html,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Mailjet API error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string
  ): Promise<boolean> {
    if (!to || to.trim() === "") {
      console.error("Empty email address provided to sendVerificationEmail");
      return false;
    }

    const subject = "Verify your email address";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Email Verification</h1>
        <p style="color: #666; font-size: 16px;">
          Thank you for signing up! Please click the button below to verify your email address.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:
          <br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `;
    const text = `
      Email Verification
      
      Thank you for signing up! Please visit the following link to verify your email address:
      ${verificationUrl}
      
      If you didn't create an account, you can safely ignore this email.
    `;

    return this.sendEmail({ to, subject, html, text });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
    const subject = "Reset your password";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p style="color: #666; font-size: 16px;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:
          <br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, you can safely ignore this email.
          This link will expire in 1 hour.
        </p>
      </div>
    `;
    const text = `
      Password Reset
      
      You requested to reset your password. Please visit the following link to create a new password:
      ${resetUrl}
      
      If you didn't request a password reset, you can safely ignore this email.
      This link will expire in 1 hour.
    `;

    return this.sendEmail({ to, subject, html, text });
  }
}

export const mailjetService = new MailjetService();
