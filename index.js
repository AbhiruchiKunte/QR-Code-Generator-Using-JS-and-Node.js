import express from "express";
import qr from "qr-image";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import inquirer from "inquirer";

// Initialize Express App
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Express route to serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Express route to generate QR code and save URL
app.post("/generate", (req, res) => {
  const url = req.body.url;

  const qr_svg = qr.imageSync(url, { type: "png" });
  const qr_base64 = Buffer.from(qr_svg).toString("base64");

  // Write URL to a file
  fs.writeFile("URL.txt", url, (err) => {
    if (err) {
      console.error("Error writing URL.txt");
    } else {
      console.log("URL saved to URL.txt");
    }
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>QR Code Result</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h1>QR Code Generator</h1>
        <form action="/generate" method="post">
          <input type="text" name="url" placeholder="Enter your URL" required />
          <button type="submit">Generate QR Code</button>
        </form>
        <h2>Your QR Code:</h2>
        <img src="data:image/png;base64,${qr_base64}" alt="QR Code"/>
        <a href="/">Generate Another</a>
      </div>
    </body>
    </html>
  `);
});

// Start Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  // Inquirer CLI for QR code generation
  inquirer
    .prompt([
      {
        message: "Type in your URL: ",
        name: "URL",
      },
    ])
    .then((answers) => {
      const url = answers.URL;
      var qr_svg = qr.image(url);
      qr_svg.pipe(fs.createWriteStream("qr_img.png"));

      fs.writeFile("URL.txt", url, (err) => {
        if (err) throw err;
        console.log("The URL has been saved to URL.txt!");
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        console.error("An error occurred:", error);
      }
    });
});
