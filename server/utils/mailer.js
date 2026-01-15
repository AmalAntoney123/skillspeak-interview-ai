import nodemailer from 'nodemailer';
import '../loadEnv.js';


const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // Use an App Password if 2FA is enabled
    },
  });
};


const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkillSpeak Verification Code</title>
</head>
<body style="margin:0; padding:0; background:#050508; font-family: Arial, sans-serif; color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:linear-gradient(145deg, #0b0f1a, #0a0a12); border-radius:24px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; box-shadow:0 0 80px rgba(99,102,241,0.25);">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px 40px; text-align:center;">
              <div style="display:inline-block; padding:6px 14px; border-radius:999px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.3); color:#818cf8; font-size:10px; letter-spacing:3px; font-weight:900;">
                NEURAL SECURITY ACTIVE
              </div>
              <h1 style="margin:24px 0 0 0; font-size:36px; line-height:1.1; font-weight:900; letter-spacing:-1px;">
                Verify Your <br/>
                <span style="background:linear-gradient(135deg, #818cf8, #a855f7, #ec4899); -webkit-background-clip:text; background-clip:text; color:transparent;">
                  Identity
                </span>
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:20px 40px 40px 40px; text-align:center;">
              <p style="font-size:18px; line-height:1.6; color:#a1a1aa; margin:0 0 24px 0;">
                Use the verification code below to authorize your SkillSpeak account session.
              </p>
              <!-- Code Box -->
              <div style="margin:30px auto; padding:24px 32px; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.3); border-radius:16px; display:inline-block; letter-spacing:12px; font-size:32px; font-weight:900; color:#c7d2fe;">
                {{RESET_CODE}}
              </div>
              <p style="margin-top:24px; font-size:14px; color:#71717a; line-height:1.6;">
                This code will expire in <strong>10 minutes</strong>.  
                If you didn’t request this, ignore this message.
              </p>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background:linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);"></div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#52525b;">
                © 2026 SkillSpeak AI • Neural Security Mesh
              </p>
              <p style="margin:10px 0 0 0; font-size:12px; color:#3f3f46;">
                This is an automated message. Do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendVerificationEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: `"SkillSpeak AI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'SkillSpeak Verification Code',
      html: htmlTemplate.replace('{{RESET_CODE}}', otp),
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Verification email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: `"SkillSpeak AI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'SkillSpeak Password Reset Code',
      html: htmlTemplate.replace('{{RESET_CODE}}', otp),
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
