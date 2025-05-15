// netlify/functions/submit-issue.js
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { name, email, issue } = JSON.parse(event.body);

  if (!name || !email || !issue) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please fill in all fields' }),
    };
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'n0xsampmobile@gmail.com', // your email
      pass: 'fvpeecakzikgpcf',         // your app password
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'n0xsampmobile@gmail.com',
    subject: `New Issue Reported by ${name}`,
    text: `You have received a new issue report:\n\nName: ${name}\nEmail: ${email}\n\nIssue Description:\n${issue}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Issue submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
};
