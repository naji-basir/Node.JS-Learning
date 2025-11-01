const fs = require("fs");
const url = require("url");
const http = require("http");

//♦️FILE

// //Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// //Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => console.log(data));
// console.log("Will read!");

// fs.writeFile("./txt/output.txt", "Basir Naji", "utf-8", (err) =>
//   console.log(`${err} file has been written.`)
// );

//only once file reads syncgronously better performance and light

// // ♦️ SERVER
// ➡️ create a server

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  console.log("👉 New request:", req.url); // log every request

  const pathName = req.url;

  // Overview
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    // res.end("<h1>This is the OVERVIEW page.</h1>");
    res.end(tempOverview);

    // Product
  } else if (pathName === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    // res.end("<h1>This is the PRODUCT page.</h1>");
    res.end(tempProduct);

    //Read The Data API
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
      "my-own-header": "naji",
    });
    res.end(data);

    // 404 - Not Found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world-by-naji",
    });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>404 Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: crimson; }
          </style>
        </head>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>The page <b>${pathName}</b> does not exist.</p>
        </body>
      </html>
    `);
  }
});

// ➡️ listen to the server
server.listen(8000, "127.0.0.1", () => {
  console.log("✅ Listening on http://127.0.0.1:8000");
});
