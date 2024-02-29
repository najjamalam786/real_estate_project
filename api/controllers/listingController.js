import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/errors.js";

export const createListing = async(req, res, next) => {

    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }catch(err){
        next(err);
    }

}

// Deleting Listing from database also
export const deleteListing = async(req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, "Listing not found!"));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only delete your own listings!"));
    }

    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json('Linting has been deleted successfully')
    }catch(error){
        next(error);
    }
}

// Update user Listing
export const updateListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404, "Listing not found!"));
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only update your own listing!"));
    }

    try{
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updateListing);
    }catch(error){
        next(error);
    }
}

// Get user individual listing
export const getListing = async (req, res, next) => {

    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing) {
            return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing);
        
    }catch(error){
        next(error);
    }
}

