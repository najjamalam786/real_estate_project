// import mongoose from "mongoose";
import { errorHandler } from "../utils/errors.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Sign Up API
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const encrypt_password = bcryptjs.hashSync(password, 10);

  const user = new User({ username, email, password: encrypt_password });

  try {
    await user.save();

    res.status(201).json("Successfull user created");
  } catch (err) {
    // error handling by middleware
    next(err);
    // next(errorHandler(550, 'error from the function'));
  }
};

// Sign In API
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(401, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid password!"));
    }

    // json web token are help to save password and email authentication
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // print all details except password
    const { password: pass, ...rest } = validUser._doc;

    // res.cookie('access_token', token, { httpOnly: true, expire: new Date(Date.now() + 24 * 60 * 60 * 1000)})

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google sign In authentication Api
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
    // password is required "else to just ignore them"
    else {
      // generated random password from String(36) "36 means (0-9 + a-z) " and slice(-8) "means also get last 8 digits" and + same thing "mean 8 + 8 = 16 characters long passward"
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // encrypt the generated password
      const encrypt_password = bcryptjs.hashSync(generatedPassword, 10);

      // Converth user name this "Najjam Alam" into "najjamalam73648ielj"
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: encrypt_password,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};

// update Users
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
  return next(errorHandler(401, "You can only update your own account!"));


try {
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  
  const updateUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    },
  },
  { new: true }
  );
  
  const { password, ...rest } = updateUser._doc;
  
  res.status(201).json(rest);
} catch (err) {
  next(err);
  }
};
