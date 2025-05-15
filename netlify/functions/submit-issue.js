const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON' }),
    };
  }

  const { name, email, issue } = data;

  if (!name || !email || !issue) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please fill in all fields' }),
    };
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'n0xsampmobile@gmail.com',
      pass: 'fvpeecakzikgpcf',
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

js
Kopiuj
Edytuj
document.getElementById('issueForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/.netlify/functions/submit-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Issue submitted successfully!');
      this.reset();
    } else {
      const errorData = await response.json();
      alert(`Failed to submit issue: ${errorData.message || 'Unknown error'}`);
    }
  } catch (err) {
    alert('Error submitting issue');
  }
});