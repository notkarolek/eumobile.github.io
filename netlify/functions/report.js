const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS so your frontend can talk to this backend
app.use(express.json()); // To parse JSON bodies

app.post('/submit-issue', async (req, res) => {
  const { name, email, issue } = req.body;

  if (!name || !email || !issue) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Configure transporter - Using Gmail SMTP
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'n0xsampmobile@gmail.com',       // <-- Your Gmail address here
      pass: 'fvpeecakzikgpcf',    // <-- Use an App Password, NOT your Gmail password
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
    res.status(200).json({ message: 'Issue submitted successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
