const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

router.get("/", async (req, res) => {
  const { categories } = req.query;
  let filter = {};
  if (categories) {
    filter = { category: categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.json(productList);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const singleProduct = await Product.findById(id).populate("category");
  if (!singleProduct) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.json(singleProduct);
});

router.post("/", async (req, res) => {
  const {
    name,
    image,
    countInStock,
    description,
    richDescription,
    brand,
    price,
    category,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    return res.status(400).send("Invalid Category");
  }

  let product = new Product({
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  });
  product = await product.save();
  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const validObjectId = mongoose.isValidObjectId(id);
  const {
    name,
    image,
    countInStock,
    description,
    richDescription,
    brand,
    price,
    category,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  if (!validObjectId) {
    return res.status(400).send("Invalid Product Id");
  }

  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    return res.status(400).send("Invalid Category");
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      image,
      countInStock,
      description,
      richDescription,
      brand,
      price,
      category,
      rating,
      numReviews,
      isFeatured,
    },
    { new: true }
  );
  if (!product) {
    return res.status(400).send("the product cannot be updated!");
  }
  res.send(product);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const validObjectId = mongoose.isValidObjectId(id);
  if (!validObjectId) {
    return res.status(400).send("Invalid Product Id");
  }
  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount,
  });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const featuredProductCount = await Product.find({ isFeatured: true }).limit(
    +count
  );

  if (!featuredProductCount) {
    res.status(500).json({ success: false });
  }
  res.send(featuredProductCount);
});

module.exports = router;
