// index.js
import express from "express";
import qr from "qr-image";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate", (req, res) => {
  const url = req.body.url;

  const qr_svg = qr.imageSync(url, { type: "png" });
  const qr_base64 = Buffer.from(qr_svg).toString("base64");

  fs.writeFile("URL.txt", url, (err) => {
    if (err) console.error("Error writing URL.txt");
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
