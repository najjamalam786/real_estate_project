import express from "express";

import { google, signIn, signUp, signOut, updateUser, deleteUser, getUserListings } from '../controllers/userController.js';
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router
.post('/signup', signUp)
.post('/signin', signIn)
.get('/signout', signOut)
.post('/google', google)
.post('/update/:id',verifyToken, updateUser)
.delete('/delete/:id', verifyToken, deleteUser)
.get('/listings/:id', verifyToken, getUserListings)



export default router;