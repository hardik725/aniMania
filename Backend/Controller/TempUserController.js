import TempUser from "../Model/TempUser.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

export const createTemspUser = async (req, res) => {
  const { Username, Password, Email } = req.body;

  if (!Username || !Password || !Email) {
    return res.status(400).json({ error: "Username, Password, and Email are required" });
  }

  try {
    // Check if username already exists
    const existingUser = await TempUser.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Generate a 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Create the TempUser in the database
    const tempUser = new TempUser({
      Username,
      Password,
      Email,
      VerificationCode: verificationCode,
    });

    await tempUser.save();

    // Send the verification code via email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Your Verification Code",
      text: `Hello ${Username}, your verification code is: ${verificationCode}`,
    });

    res.status(201).json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create temp user" });
  }
};

export const verifyTempUser = async (req, res) => {
    const { Username, Password , VerificationCode } = req.body;
  
    if (!Username || !VerificationCode || !Password) {
      return res.status(400).json({ error: "Username, Verification & Password Code are required" });
    }
  
    try {
      // Find the TempUser by username
      const tempUser = await TempUser.findOne({ Username });
  
      if (!tempUser) {
        return res.status(404).json({ error: "Temp user not found or verification code expired" });
      }
  
      // Check if the verification code matches
      if (tempUser.VerificationCode !== VerificationCode) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      if(tempUser.Password !== Password){
        return res.status(400).json({error: "Invalid verification code"});
      }
      const trimmedUsername = Username.trim();
      const trimmedEmail = tempUser.Email.trim();
      const trimmedPass = Password.trim();

      const response = await fetch("https://animania-backend-dmjs.onrender.com/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Username: trimmedUsername,
            Email: trimmedEmail,
            Password: trimmedPass,
        }),
      });
  
      const signupResponse = await response.json();
  
      if (!response.ok) {
        return res.status(response.status).json({ error: signupResponse.error || "Signup failed" });
      }
  
      // Verification successful, delete the TempUser
      await TempUser.deleteOne({ _id: tempUser._id });
  
      res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to verify user" });
    }
  };
  
