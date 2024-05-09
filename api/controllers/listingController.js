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

// Search get all listings
export const SearchListings = async (req, res, next) => {
    try{
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
    
        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            // "$in" is an operator in mongoDB show all listings that are "false" as well as "true" both offer listings would be showed
            offer = { $in: [false, true] };
            
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = { $in: [false, true] };
        }
        let type = req.query.type;
        if(type === undefined || type === "all"){
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';
        const address = req.query.address || '';

        // sort by latest first listing "createdAt"
        const sort = req.query.sort || 'createdAt';
        //  createdAt descending order "desc"
        const order = req.query.order || 'desc';

        const listing = await Listing.find({

            // "$regex" is built in search functionality for mongoDB
            // "$options" don't care about lower/upper case sensitivity in searching
            name: { $regex: searchTerm, $options: 'i' },
            address: { $regex: address, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
            // 'sort-order' use to sorted high to low or low to high price
        })
        .sort({[sort]: order})
        .limit(limit)
        .skip(startIndex);

        return res.status(200).json(listing);

            
    }catch(error){
        next(error);
    }
}
