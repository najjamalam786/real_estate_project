import dotenv from 'dotenv';
dotenv.config();
// import {} from "dotenv/config";
// import cors from 'cors'
import express from 'express'
import mongoose from "mongoose";
import userRouter from './routers/userRoute.js';
import listingRouter from './routers/listingRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';



mongoose.connect(process.env.NEW_DB_COMPASS).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err, "not working");
})

// this computer and another computer this code will run use "__dirname" for path
const __dirname = path.resolve();

const app = express();

app.listen(process.env.PORT, () => {
    console.log("Server run localhost:3000");
})


//bodyParser
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

// after this API write otherwise code not work, for home page
app.use(express.static(path.join(__dirname, 'client/dist')));

// any address or path access using "*" method
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", 'dist', 'index.html'))
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
