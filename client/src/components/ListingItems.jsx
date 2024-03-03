import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md";



export default function ListingItems({ listing }) {
  return (
    <div className="bg-slate-200 shadow-md rounded-lg hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listingImg"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700
              ">
            {listing.name}

          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="text-sm w-full text-gray-700 truncate">

              {listing.address}
            </p>
          </div>
          <div className="items-center gap-1">

            <p className="text-sm text-gray-700 line-clamp-3">

              {listing.description}
            </p>
            <p className="text-slate-800 mt-3 font-semibold flex items-center">
              $
              {listing.offer ? listing.discountPrice.toLocaleString("en-US") : listing.regularPrice.toLocaleString("en-US")}

              {listing.type === 'rent' && '/ month'}
            </p>

            <div className="text-slate-800 text-sm font-semibold mt-2 flex gap-4">
              <div className="">
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </div>

              <div className="">
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>
        </div>
      </Link>




    </div>
  )
}

// "truncate" and "line-clamp-3" use to long string like "ajsjfj......"
