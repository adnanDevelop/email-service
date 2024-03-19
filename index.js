const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "gomarkho@outlook.com",
    pass: "Lmkt@ptcl1234",
  },
});

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/submit-form", upload.single("resume"), (req, res) => {
  const { name, email, position, coverLetter, number } = req.body;
  const resumePath = req.file.path;

  const mailOptions = {
    from: "gomarkho@outlook.com",
    to: "adnan6official@gmail.com",
    subject: `Name: ${name} - Position: ${position}`,
    text: `Name: ${name}\nEmail: ${email}\nPosition: ${position}\nCover Letter: ${coverLetter}\nNumber: ${number}  `,
    attachments: [
      {
        filename: req.file.originalname,
        path: resumePath,
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
      res.status(500).send("Error occurred while sending email.");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
