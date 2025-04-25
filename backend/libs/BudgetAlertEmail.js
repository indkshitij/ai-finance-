const sendMail = (email, name, usage) => {
    return {
      to: email,
      subject: "⚠️ Budget Limit Alert!",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
          <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; color: #3B82F6; font-family: 'Poetsen One', sans-serif;">N</h1>
            <p style="margin: 0; font-size: 18px; color: #374151; font-weight: 600;">NeoFinance</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #3B82F6;">Hello ${name},</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              We noticed that your monthly expenses have exceeded <strong>${usage}%</strong> of your set budget.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Staying on track is key to achieving your financial goals. We recommend reviewing your spending habits and making necessary adjustments to stay within your limits.
            </p>
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; margin-top: 20px; background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Review Your Budget
            </a>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">You're receiving this notification because you enabled budget tracking in your NeoFinance account.</p>
            <p style="margin-top: 10px; font-size: 14px; color: #9ca3af;">NeoFinance Team</p>
          </div>
        </div>
      `,
    };
  };
  
  export default sendMail;
  