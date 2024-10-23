const verifyEmailHTML = (name: string, verificationCode: string) => `
  <div style="background-color: #fff; padding: 20px;>
    <p style="color: black; font-size: 28px; font-weight: bold; margin-bottom: 20px;">Synthesise.Me</p>
    <p style="color: black; font-size: 20px; font-weight: bold;">Dear ${name},</p>
    <p style="color: #BFBEBD; font-size: 16px;">Here are your verify email instructions.</p>
    <p style="color: black; font-size: 16px; margin: 20px 20px;">We've received your request to reset your password for Synthesise.Me . To proceed, please enter the following link to go to the password recovery form.</p>
    <div style="text-align: center;">
      <span style="display: inline-block; padding: 10px 20px; color: black; font-size: 20px; font-weight: bold; margin-bottom: 20px;">${verificationCode}</span>
    </div>
    <p style="color: black; font-size: 16px;">
      <span>Please note:</span><br/>
      <span style="margin-left: 15px;">· This link is valid for 2 hours.</span><br/>
      <span style="margin-left: 15px;">· If you did not request this password reset, please disregard this email.</span><br/>
      <span>If you have any issues or require further assistance, please contact our support team at support@synthesise.me or 555-555-555.</span>
    </p>
  </div>
`;

const resetPasswordEmail = (name: string, resetPsswordLink: string) => `
      <div style="background-color: #fff; padding: 20px;>
        <p style="color: black; font-size: 28px; font-weight: bold; margin-bottom: 20px;">Synthesise.Me</p>
        <p style="color: black; font-size: 20px; font-weight: bold;">Dear ${name},</p>
        <p style="color: #BFBEBD; font-size: 16px;">Here are your password reset instructions.</p>
        <p style="color: black; font-size: 16px; margin: 20px 20px;">We've received your request to reset your password for Synthesise.Me . To proceed, please enter the following link to go to the password recovery form.</p>
        <div style="text-align: center;">
          <a href="${resetPsswordLink}" style="padding: 10px 20px; color: black; margin-bottom: 20px;">${resetPsswordLink}</a>
        </div>
        <p style="color: black; font-size: 16px;">
          <span>Please note:</span><br/>
          <span style="margin-left: 15px;">· This link is valid for 2 hours.</span><br/>
          <span style="margin-left: 15px;">· If you did not request this password reset, please disregard this email.</span><br/>
          <span>If you have any issues or require further assistance, please contact our support team at support@synthesise.me or 555-555-555.</span>
        </p>
      </div>
  `;

export { verifyEmailHTML, resetPasswordEmail };
