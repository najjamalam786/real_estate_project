import mongoose from 'mongoose';

// const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
        
    }
}, { timestamps: true });

// there are 'User_signp' and in db there are created user_signups in plural form
const User = mongoose.model('User_signup', userSchema);
export default User;