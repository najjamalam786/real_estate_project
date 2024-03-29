import { errorHandler } from "./errors.js";
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized user najjam bro'));
     
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return next(errorHandler(403, 'Forbidden najjam alala'));

        req.user = user;
        next();
    });
};