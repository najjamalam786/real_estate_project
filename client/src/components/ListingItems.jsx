import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md";
import {
  FaHouseUser,
  FaBath,
  FaBed
} from 'react-icons/fa';



export default function ListingItems({ listing }) {
  return (
    <div className="bg-slate-200 shadow-md rounded-lg hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[280px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listingImg"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">

        <div className="flex items-end justify-between">
        <p className="text-slate-800 mt-3 text-lg font-bold flex items-center">
            ₹
              {listing.offer ? listing.discountPrice.toLocaleString("en-US") : listing.regularPrice.toLocaleString("en-US")}

              {listing.type === 'rent' && '/ month'}
            </p>

            <span className={`${listing.type === 'rent' ? 'bg-emerald-200 text-emerald-600-600' : 'bg-blue-200 text-blue-600'} font-bold text-sm px-4 py-1 rounded-md`}>{listing.type}</span>
        </div>
        
          

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="text-sm w-full text-gray-500 font-semibold truncate">

              {listing.address}
            </p>
          </div>
          <div className="items-center gap-1">

            <p className="text-sm text-gray-700 line-clamp-2">

              {listing.description}
            </p>
            

            <div className="text-slate-800 text-sm font-semibold mt-2 flex gap-4 ">
              <div className="flex items-center gap-1 border-2 border-dotted border-slate-500 py-1 px-2 rounded-md">
                <FaBed />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </div>

              <div className="flex items-center gap-1 border-2 border-dotted border-slate-500 py-1 px-2 rounded-md">
              <FaBath/>

                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>

          
          <span className="font-semibold text-red-500 text-sm "> Owner</span>
          
          <p className=" flex items-center justify-center gap-2 bg-rose-600 truncate lg:text-base text-sm  font-semibold text-white px-2 py-1 mr-2 rounded-md
              ">
                <FaHouseUser/>
                {listing.name}
          </p>
        </div>
      </Link>




    </div>
  )
}

// "truncate" and "line-clamp-3" use to long string like "ajsjfj......"