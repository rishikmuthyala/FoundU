import express from 'express';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 3000;

// Set up storage for Multer - store images in uploads folder
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a timestamp prefix
  },
});

const upload = multer({ storage });

// Image upload
app.post('/upload', upload.single('ucardImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Image upload failed');
  }

  // Path of uploaded image
  const imagePath = path.resolve(req.file.path);
  const studentName = req.body.name;

  // Web scrape emails 
  const studentEmails = await getStudentEmails(studentName);

  if (studentEmails.length === 0) {
    return res.status(404).send('No emails found for the given student name');
  }

  // Send email with the uploaded image attached
  try {
    for (const email of studentEmails) {
      await sendEmail(email, studentName, imagePath);
    }
    res.status(200).send('Emails sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).send('Failed to send email');
  }
});

// Function to send email using Nodemailer
async function sendEmail(studentEmail, studentName, imagePath) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: studentEmail,
    subject: `Lost UCard Found - Is this yours, ${studentName}?`,
    html: `
      <h1>Lost UCard Found</h1>
      <p>Dear ${studentName},</p>
      <p>We found a UCard that may belong to you. Please see the attached image.</p>
      <p>If this card is yours, please reply to this email so that we can help return it to you.</p>
      <p>If this card is not yours, please disregard this email.</p>
      <br>
      <p>Thank you,</p>
      <p>UCard Finder Team</p>
    `,
    attachments: [
      {
        filename: 'ucard.jpg',
        path: imagePath, // Attach the uploaded UCard image
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

async function getStudentEmails(studentName) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Load cookies from the saved file
  try {
    const cookiesString = fs.readFileSync('./cookies.json', 'utf-8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  } catch (error) {
    console.error('Error reading cookies:', error);
    await browser.close();
    return [];
  }

  // Navigate to People Finder page (you should be logged in automatically)
  await page.goto('https://www.umass.edu/peoplefinder/private', { waitUntil: 'networkidle2' });

  // Search for the student name
  await page.type('#search_text', studentName);
  await timeout(1000);
  await page.click('#search_btn');
  await timeout(3000);
  // Adding a delay to ensure all email elements are rendered properly

  // Extract email addresses from the search results
  const emails = await page.evaluate(() => {
    const emailElements = Array.from(document.querySelectorAll('span.email a'));
    return emailElements.map(el => el.textContent.trim());
  });

  console.log('Emails found:', emails);
  await browser.close();
  return emails; // List of emails found
}

// Utility function to add a delay
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
