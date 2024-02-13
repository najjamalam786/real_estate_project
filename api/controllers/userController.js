// import mongoose from "mongoose";
// import { errorHandler } from '../utils/errors.js'
import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';


export const signUp = async(req, res, next) => {
    const {username, email, password} = req.body;

    const decrypt_password = bcryptjs.hashSync(password, 10);

    const user = new User({username, email, password:decrypt_password});

    try{
        await user.save()
        
        res.status(201).json("Successfull user created");
    
    }catch(err){
        // error handling by middleware
        next(err);
            // next(errorHandler(550, 'error from the function'));
    }
    
}

export const getUser = async(req, res) => {
    // const Id = req.params.id;
    const user = await User.find();
    
    res.json(user);

    
}

