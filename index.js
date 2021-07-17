const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
});

const app = express();
app.use(formidableMiddleware());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to my TripAdviser backEnd site",
  });
});

app.post("/contact", async (req, res) => {
  try {
    console.log(req.fields);
    const fName = req.fields.firstname;
    const lName = req.fields.lastname;
    const mail = req.fields.email;
    let message = req.fields.message;
    if (!message) {
      message = "Bonjour";
    }
    const data = {
      from: `${fName} ${lName} <${mail}>`,
      to: process.env.MY_MAIL,
      subject: "Hello",
      text: message,
    };
    console.log(data);

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log(error);
        res.status(401).json(error);
      } else {
        console.log(body);
        res.status(200).json({
          message: "Merci pour votre incription",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    console.log(error.message);
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log("Server is running..."));
