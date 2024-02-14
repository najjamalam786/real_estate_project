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
        
    },
    avatar:{
        type:String,
        default:"https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg?size=338&ext=jpg&ga=GA1.1.87170709.1707868800&semt=ais"
    }
}, { timestamps: true });

// there are 'User_signp' and in db there are created user_signups in plural form
const User = mongoose.model('User_signup', userSchema);
export default User;