import { Resend } from "resend";
import Email from "./Email.js";
import ReactDOMServer from "react-dom/server";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || " ");

async function SendEmail({ to, subject, userName, type, data }) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "NeoFinance <onboarding@resend.dev>",
      to,
      subject,
      html: Email({ userName, type, data }),
    });

    if (error) {
      console.error("Email sending failed:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", result);
    return { success: true, data: result };
  } catch (err) {
    console.error("Unexpected error while sending email:", err);
    return { success: false, error: err.message || "Unexpected error" };
  }
}

export default SendEmail;
