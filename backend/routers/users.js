const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).jaon({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
    street,
  } = req.body;
  let user = new User({
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
    street,
  });

  user = await user.save();

  if (!user) {
    return res.status(400).send("the user cannot be created!");
  }

  res.send(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.SECRET;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
    street,
  } = req.body;
  let user = new User({
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
    street,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndRemove(id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;
