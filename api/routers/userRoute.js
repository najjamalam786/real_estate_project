import express from "express";

import { signIn, signUp } from '../controllers/userController.js';
const router = express.Router();

router
.post('/signup', signUp)
.post('/signin', signIn);

export default router;