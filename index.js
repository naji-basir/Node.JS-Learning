const fs = require('fs');
const url = require('url');
const http = require('http');

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
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);

  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const server = http.createServer((req, res) => {
  console.log('👉 New request:', req.url); // log every request
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('%PRODUCT_CARDS%', cardsHtml);
    res.end(output);

    // console.log(cardsHtml);

    // Product
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    console.log(query);
    res.end(output);

    //Read The Data API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
      'my-own-header': 'naji',
    });
    res.end(data);

    // 404 - Not Found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world-by-naji',
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
          <p>The page <b>${pathname}</b> does not exist.</p>
        </body>
      </html>
    `);
  }
});

// ➡️ listen to the server
server.listen(8000, '127.0.0.1', () => {
  console.log('✅ Listening on http://127.0.0.1:8000');
});
