import express from "express";

import { google, signIn, signUp, updateUser } from '../controllers/userController.js';
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router
.post('/signup', signUp)
.post('/signin', signIn)
.post('/google', google)
.post('/update/:id',verifyToken, updateUser);


export default router;