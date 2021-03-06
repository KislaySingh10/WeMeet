const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validates, validateUser } = require("../models/user");
const { Room } = require("../models/room");
const { valid } = require("joi");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(400).send("User doesn't exists");
  res.send(user);
});

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("User already registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  });
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      config.get("jwtPrivateKey")
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    console.log("error: ", err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validates(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user) return res.send("User already logged in!");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).json("invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    config.get("jwtPrivateKey")
  );
  res.cookie("token", token, {
    expire: new Date() + 60 * 60 * 24 * 30,
  });
  res.header("x-auth-token").send(token);
});
router.get("/logout", async(req, res)=>{
    
    try {
      res.clearCookie("token");
      return res.json({
        msg: "User signout successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
      

})

module.exports = router;
