

import nodemailer from 'nodemailer';

interface VerificationMailOptions{
    link: string;
    to: string;
    name: string;
}
const TOKEN  = process.env.MAILTRAP_TOKEN; 

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_TEST_USER,
        pass: process.env.MAILTRAP_TEST_PASS,
    },
});

const sendVerificationMailProd = async (options: VerificationMailOptions) => {
    const sender = {
        email:"no-reply@fsSujal.dev",
        name: "user sign in"
    }; 
    const recipients = {
        email: options.to,
    }
}

const sendVerificationTestMail = async (options: VerificationMailOptions) => {
  console.log("📨 Sending mail via Mailtrap...");

  await transport.sendMail({
    to: options.to,
    from: process.env.VERIFICATION_MAIL,
    subject: "Set your password",
    html: `
      <h2>Welcome to our app 👋</h2>
      <p>Click the button below to set your password:</p>
      <a href="${options.link}" 
         style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none;">
         Set Password
      </a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
console.log("Verification Link:", options.link);
  console.log("✅ Mail sent");
};


// here we will write the code to send email in production and development both.
// in development we will use mailtrap to test our email sending functionality and in production we can use any email service provider like sendgrid, mailgun, etc.
// for development we will use mailtrap to test our email sending functionality.
const mail = {
    async sendVerificationMail(options: VerificationMailOptions){
    if(process.env.NODE_ENV === "development"){
         await sendVerificationTestMail(options); 
    }
    else{
        await sendVerificationMailProd(options); 
    }
    }
};

export default mail;