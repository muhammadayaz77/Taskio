import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.SEND_GRID_API?.trim();
const fromEmail = process.env.FROM_EMAIL?.trim();

if (!apiKey) {
  console.error("❌ SEND_GRID_API is not set in .env");
} else {
  sgMail.setApiKey(apiKey);
}

export const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", to);
    return true;
  } catch (error) {
    // Log the full SendGrid error response for easier debugging
    if (error.response) {
      console.error("❌ SendGrid error status:", error.response.status);
      console.error("❌ SendGrid error body:", JSON.stringify(error.response.body, null, 2));
    } else {
      console.error("❌ Error sending mail:", error.message);
    }
    return false;
  }
};