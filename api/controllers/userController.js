// import mongoose from "mongoose";
import { errorHandler } from "../utils/errors.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const {password: pass, ...rest} = validUser._doc;


    // res.cookie('access_token', token, { httpOnly: true, expire: new Date(Date.now() + 24 * 60 * 60 * 1000)})

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }

  
};
