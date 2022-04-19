const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createTestAccount } = require("nodemailer");

const contact = async (req, res, next) => {
  console.log("contact");

  console.log(req.body);

  const { name, surname, email, phone, textContent, lang } = req.body;

  const outputInternalEmailAsHTML = `
  <p>New contact form request</p>
  <h3>Contact details</h3>
  <ul>
  <li>Name: ${name}</li>
  <li>Surname: ${surname}</li>
  <li>E-mail: ${email}</li>
  <li>Phone: ${phone}</li>
  </ul>
  <h3>Contact details</h3>
  <p>Contact Form Text: ${textContent}</p>
  `;

  const outputInternalEmailAsPLainText = `
  New contact form request
  >Contact details
  Name: ${name},
  Surname: ${surname},
  E-mail: ${email},
  Phone: ${phone},
  >Contact details
  Contact Form Text: ${textContent}
  `;

  const outputClientEmailAsHtmlEn = `
  <h3>Message was sent</h3>
  <p>Hi, ${name}</p>
  <h3>Email with data such a data has been sent to us.</h3>
  <ul>
  <li>Name: ${name}</li>
  <li>Surname: ${surname}</li>
  <li>E-mail: ${email}</li>
  <li>Phone: ${phone}</li>
  </ul>
  <h3>Contact details</h3>
  <p>Contact Form Text: ${textContent}</p>
  <br/>
   <p>Thank you, we'll answer as soon as possible.</p>
     <br/>
   <p>Regards,</p>
   <p>Ante team.</p>
  `;

  const outputClientEmailAsHtmlPl = `
  <h3>Wiadomość została wysłana</h3>
  <p>Hi, ${name}</p>
  <h3>Dane przez Ciebie przekazane:</h3>
  <ul>
  <li>Imię: ${name}</li>
  <li>Nazwisko: ${surname}</li>
  <li>E-mail: ${email}</li>
  <li>Telefon: ${phone}</li>
  </ul>
  <h3>Zapytanie:</h3>
  <p>treść zapytania: ${textContent}</p>
  <br/>
  <p>Dziękujemy za wiadomość. Odpowiemy wkrótce.</p>
  <br/>
  <p>Pozdrawiamy,</p>
  <p>Firma Ante</p>
  `;

  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: `"Nodemailer contact" <${process.env.NODEMAILER_USER}>`, // sender address
    to: `${process.env.NODEMAILER_TO_EMAIL}`, // list of receivers
    subject: "ANTE.PL - Contact Form", // Subject line
    text: outputInternalEmailAsPLainText, // plain text body
    html: outputInternalEmailAsHTML, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
  });

  res.json({
    messagePl: "Formularz kontaktowy został wysłany, dziękujemy.",
    messageEn: "Contact Form Data sent. Thank you",
    name,
    surname,
    email,
    phone,
    textContent,
  });
};

exports.contact = contact;
