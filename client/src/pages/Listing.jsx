import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import {
  FaHouseUser,
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';



export default function Listing() {

  SwiperCore.use([Navigation]);

  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const {currentUser} = useSelector((state) => state.user);



  useEffect(() => {

    const fetchListing = async () => {

      try {

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);

      } catch (error) {
        setError(true);
        setLoading(false);

      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loding...</p> && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

      {listing && !loading && !error &&
        (
          <div>
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {/* {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )} */}
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>

              <div className="flex items-center justify-between">
              <p className='flex items-center gap-2 text-rose-700 font-semibold text-2xl'>
                <FaHouseUser size={32} className='' />
                {listing.name} 
              </p>
                <span className="bg-green-100 text-green-600 font-bold text-sm px-4 py-1 rounded-md">Owner</span>
              </div>

              <p className='text-slate-700 text-4xl font-bold'>
              ₹{' '}
              {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' ? ' / month' : ' price'}
              </p>
              <p className='flex items-center mt-6 gap-2 bg-slate-200 py-2 px-4 rounded-md text-slate-600  text-lg'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>

              <div className='flex gap-4'>
                <p className='bg-slate-200 w-full max-w-[100px] text-blue-600 font-bold text-center p-1 rounded-md'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-slate-200 text-green-600 w-full max-w-[200px] font-bold text-center p-1 rounded-md'>
                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <p className='bg-slate-200 py-4 px-4 font-semibold  text-slate-500'>
                <p className=' font-bold text-black rounded-md mb-4'>About This Property </p>
                {listing.description}
                </p>
                <ul className=' text-green-900 front-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>

                  <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaBed className='text-lg' />
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaBath className='text-lg' />
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaParking className='text-lg' />
                    {listing.parking ? 'Parking spot' : 'No parking'}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaChair className='text-lg' />
                    {listing.furnished ? 'Furnished' : 'Not furnished'}
                  </li>
                </ul>

                <div className="flex items-center gap-4 mt-4">
                  <p className='bg-green-500 font-semibold text-white p-3 capitalize rounded-lg cursor-pointer'>
                    View on Google Maps
                  </p>
                  <Link to="/" className='bg-emerald-700 text-white p-3 capitalize rounded-lg font-semibold'>
                    Contact Seller
                  </Link>
                </div>

                {currentUser && (
                  listing.useRef !== currentUser._id && !contact && (
                    <button onClick={() => setContact(true)} className='bg-slate-700 text-white p-3 capitalize font-semibold tracking-widest rounded-lg'>
                      Message Landlord
                    </button>
                    
                  )
                )}
                { contact && (
                  <Contact listing={listing}/>
                )}
            </div>
          </div>
          

        )}
    </main>
  )
}
