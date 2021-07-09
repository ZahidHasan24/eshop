const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./routers/products");
require("dotenv/config");

const app = express();

const api = process.env.API_URL;

// middleware
app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));

// Routers
app.use(`${api}/products`, productsRouter);

//Database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
