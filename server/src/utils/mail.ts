import { MailtrapClient } from 'mailtrap';


interface VerificationMailOptions{
    link: string;
    to: string;
    name: string;
}
const TOKEN = process.env.MAILTRAP_TOKEN!

const client = new MailtrapClient({
  token: TOKEN,
});


// const transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: process.env.MAILTRAP_TEST_USER,
//         pass: process.env.MAILTRAP_TEST_PASS,
//     },
// });


// const sendVerificationTestMail = async (options: VerificationMailOptions) => {
 

//   await transport.sendMail({
//     to: options.to,
//     from: process.env.VERIFICATION_MAIL,
//     subject: "Set your password",
//     html: `
//       <h2>Welcome to our app , ${options.name}</h2>
//       <p>Click the button below to set your password:</p>
//       <a href="${options.link}" 
//          style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none;">
//          Set Password
//       </a>
//       <p>This link will expire in 24 hours.</p>
//     `,
//   });

// };


// here we will write the code to send email in production and development both.
// in development we will use mailtrap to test our email sending functionality and in production we can use any email service provider like sendgrid, mailgun, etc.
// for development we will use mailtrap to test our email sending functionality.


const sendVerificationMailProd = async (options: VerificationMailOptions) => {
    
const sender = {
  email: "hello@fableforge.website",
  name: "FableForge",
};
const recipients = [
  {
    email: options.to,
  }
];


try {
  const response = await client.send({
    from: sender,
    to: recipients,
    subject: "Set your password",
    html: `
      <h2>Welcome to FableForge, ${options.name}</h2>
      <p>Click the button below to set your password:</p>

      <a href="${options.link}"
      style="
        display:inline-block;
        padding:12px 24px;
        background:#4CAF50;
        color:#fff;
        text-decoration:none;
        border-radius:6px;">
      Set Password
    </a>
      <p>This link will expire in 24 hours.</p>
    `,
  });

  console.log("Mail sent:", response);
} catch (err) {
  console.error("Mailtrap Error:", err);
  throw err;
}
}
const mail = {
    async sendVerificationMail(options: VerificationMailOptions){
   
    
  await sendVerificationMailProd(options); 
    
    }
};

export default mail;








