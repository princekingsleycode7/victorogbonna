// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // You can use any port

// Middleware
app.use(cors()); // Allows requests from other origins (your frontend)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST route for sending email
app.post('/send-email', (req, res) => {
    const { contactName, contactEmail, contactSubject, contactMessage } = req.body;

    // IMPORTANT: Use environment variables for credentials in a real application!
    // For Gmail, you may need to use an "App Password" if you have 2-Factor Auth enabled.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email provider
        auth: {
            user: 'your-email@gmail.com', // Your email address
            pass: 'your-email-password-or-app-password' // Your password or App Password
        }
    });

    const mailOptions = {
        from: `"${contactName}" <${contactEmail}>`, // Sender's name and email
        to: 'your-receiving-email@example.com', // The email address that will receive the form submissions
        subject: `New Contact Form Submission: ${contactSubject}`,
        html: `
            <h3>New Message from your Website Contact Form</h3>
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${contactEmail}</p>
            <p><strong>Subject:</strong> ${contactSubject}</p>
            <p><strong>Message:</strong></p>
            <p>${contactMessage}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Something went wrong.');
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});