import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItems from '../components/ListingItems';
import SearchBar from '../components/SearchBar';



export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      
      try{
        const res = await fetch('/api/listing/get?offer=true&limit=4');

        const data = await res.json();
        setOfferListings(data);
        
        fetchRentListings();


      }catch(err)
      {
        console.log(err);
      }
    }

    const fetchRentListings = async () => {

      try {
        
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();

        setRentListings(data);

        fetchSaleListings();

      } catch (error) {
        console.log(error);
        
      }
    }

    const fetchSaleListings = async () => {
      
      try {
        
        const res = await fetch("/api/listing/get?type=sale&limit=4");

        const data = await res.json();

        setSaleListings(data);

      } catch (error) {
        console.log(error);
        
      }
    }
    fetchOfferListings();
  }, []);

  return (
    <div className="">
      {/* <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Najjam Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        
        <Link to="/search" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div> */}

      {/* swiper */}
      <SearchBar/>
      <Swiper navigation>
      {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div  style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className="h-[500px]">
         


            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>

      <div className="flex flex-col gap-6 p-6 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Property Zone is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        
        <Link to="/search" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>

      {/* Listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              
              <h2 className="text-2xl my-3 font-semibold text-slate-600">Recent Offers</h2>
              <div className="w-full overflow-x-scroll no-scrollbar">
              <div className="w-[65rem] lg:w-[90rem] flex gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItems listing={listing} key={listing._id} />
                  ))
                }
              </div>
              </div>

              <div className="my-3">
                <Link className='text-sm font-semibold text-blue-800' to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>
            </div>
          )
        }


        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              
              <h2 className="text-2xl my-3 font-semibold text-slate-600">Recent places for rent</h2>
              <div className="w-full overflow-x-scroll no-scrollbar">
              <div className="w-[65rem] lg:w-[90rem] flex gap-4 ">
                {
                  rentListings.map((listing) => (
                    <ListingItems listing={listing} key={listing._id} />
                  ))
                }
              </div>
              </div>

              <div className="my-3">
                
                <Link className='text-sm font-semibold text-blue-800' to={'/search?type=rent'}>
                  Show more rents
                </Link>
              </div>

            </div>
          )
        }

        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              
              <h2 className="text-2xl my-3 font-semibold text-slate-600">Recent places for sales </h2>

              <div className="w-full overflow-x-scroll no-scrollbar">
              <div className="w-[65rem] lg:w-[90rem] flex gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItems key={listing._id} listing={listing} />
                  ))
                }
              </div>
              </div>

              <div className="my-3">
                
                <Link className='text-sm font-semibold text-blue-800' to={'/search?type=sale'}>
                  Show more sales
                </Link>
              </div>

            </div>
          )
        }
      </div>
    </div>
  )
}
