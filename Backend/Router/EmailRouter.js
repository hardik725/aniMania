import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Contact Form Route
  router.post('/contact', async (req, res) => {
    const { Email, Message, Username } = req.body;
  
    // Validate required fields
    if (!Username || !Email || !Message) {
      return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }
  
    try {
      const mailOptions = {
        from: Email,
        to: process.env.EMAIL_USER,
        subject: `New Contact Us Message from ${Name}`, // Custom subject
        text: `Name: ${Name}\nEmail: ${Email}\n\nMessage:\n${Message}`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Something went wrong, please try again later.' });
    }
  });

  export default router;