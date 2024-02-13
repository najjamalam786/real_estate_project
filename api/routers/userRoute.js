import express from "express";

import { getUser, signUp } from '../controllers/userController.js';
const router = express.Router();

router
.post('/signup', signUp)
.get('/data', getUser);

export default router;