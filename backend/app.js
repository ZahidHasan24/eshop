const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

const api = process.env.API_URL;

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.json(productList);
});

app.post(`${api}/products`, (req, res) => {
  const { name, image, countInStock } = req.body;
  const product = new Product({
    name,
    image,
    countInStock,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

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
