import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email, verificationToken, purpose = 'verification') {
    const subject = purpose === 'forgot' 
      ? "Verify your email" 
      : "✨ Verify your email address";

    const mailOptions = {
      from: process.env.MAIL_FROM || `"IntelliQuiz" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: this.getEmailTemplate(verificationToken, purpose),
      text: purpose === 'forgot' 
        ? `Your verification code is: ${verificationToken}`
        : `Welcome to IntelliQuiz! Please verify your email: ${verificationToken}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  getEmailTemplate(verificationToken, purpose) {
    const actionText = purpose === 'forgot' 
      ? "reset your password" 
      : "verify your email address";

    return `
<div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:30px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:25px;">
    
    <!-- Header -->
    <div style="text-align:center; margin-bottom:25px;">
      <h1 style="color:#4199c7; margin:0; font-size:32px; font-weight:700;">IntelliQuiz</h1>
      <p style="color:#555; font-size:16px; margin-top:6px; font-weight:500;">Secure Email Verification</p>
    </div>

    <!-- Greeting -->
    <p style="font-size:16px; color:#333; margin-bottom:10px;">Hello,</p>
    <p style="font-size:15px; color:#555; line-height:1.7; margin-top:0;">
      We received a request to ${actionText}. Please use the following
      <strong style="color:#4199c7;">verification code</strong>:
    </p>

    <!-- Verification Code -->
    <div style="text-align:center; margin:35px 0;">
      <span style="display:inline-block; background:#4199c7; color:#ffffff; font-size:24px; font-weight:bold; letter-spacing:3px; padding:15px 35px; border-radius:8px;">
        ${verificationToken}
      </span>
    </div>

    <!-- Note -->
    <p style="font-size:14px; color:#777; line-height:1.6; margin-top:0;">
      If you didn't request this, you can safely ignore this email.
    </p>

    <!-- Footer -->
    <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">
    <p style="font-size:13px; color:#999; text-align:center; margin:0;">
      &copy; ${new Date().getFullYear()} IntelliQuiz. All rights reserved.
    </p>
  </div>
</div>
    `;
  }
}