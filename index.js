require("dotenv").config();
require("./config/dbConnect");
const express = require("express");
const {
  scrape_meesho_product,
} = require("./controller/productScrappingController");
const app = express();
const port = +process.env.PORT;

app.get("/scrap-meeshos-product-data", scrape_meesho_product);

app.listen(port, () => {
  console.log("Server Started at PORT -", port);
});
