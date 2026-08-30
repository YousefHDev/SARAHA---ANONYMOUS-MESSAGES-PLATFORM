import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || 'demo@saraha.local';
  const pass = process.env.EMAIL_PASS || 'demopassword';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Saraha Anonymous Messages" <${user}>`,
      to,
      subject,
      text: text || 'You have received a notification from Saraha.',
      html
    });
    console.log(`✉️ Email dispatched to ${to}: Message ID ${info.messageId}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ Could not deliver email to ${to} (Simulated mode active): ${err.message}`);
    return false;
  }
};

export const getWelcomeEmailTemplate = (name, username) => {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; borderRadius: 12px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
        <h1 style="color: #6366f1; text-align: center; font-size: 28px; margin-bottom: 20px;">Welcome to Saraha! 🔒</h1>
        <p style="font-size: 16px; color: #cbd5e1;">Hi <strong>${name || username}</strong>,</p>
        <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">
          Your Saraha account has been successfully created. You can now receive honest, constructive feedback and secret messages anonymously from your friends, colleagues, and followers!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/send.html?u=${username}" style="background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">View Your Public Link</a>
        </div>
        <p style="font-size: 14px; color: #94a3b8; text-align: center;">Share your profile handle <code>@${username}</code> on social media to start receiving messages.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 30px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Saraha Anonymous Platform &copy; 2026. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getNewMessageEmailTemplate = (username) => {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
        <h2 style="color: #ec4899; text-align: center; font-size: 24px;">New Anonymous Message! 💌</h2>
        <p style="font-size: 16px; color: #cbd5e1;">Hey <strong>@${username}</strong>,</p>
        <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">
          Someone just dropped an anonymous message on your profile card. Head over to your private dashboard to unlock and view it!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/dashboard.html" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">Open Inbox Dashboard</a>
        </div>
      </div>
    </div>
  `;
};
