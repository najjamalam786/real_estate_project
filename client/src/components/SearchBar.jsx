import { FaSearch } from "react-icons/fa"
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';


export default function SearchBar() {


    
    const [searchInput, setSearchInput] = useState("");
    const [address, setAddress] = useState("");
    const [rent_sale, setRent_Sale] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        if(searchInput || address && rent_sale){
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('searchTerm', searchInput);
            urlParams.set('address', address);
            urlParams.set('type', rent_sale);
            
            

            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`);
            
        }
        
    }


  return (
    <div className="absolute top-56 left-1/2 -translate-x-1/2 z-50 w-full">
        <div className=' flex items-center justify-center '>
        <form onSubmit={handleSearchSubmit}  className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    
                    placeholder='Search...' className='bg-transparent focus:outline-none lg:w-[35rem] w-[16rem]'
                    />
                    <select name="address" onChange={(e) => setAddress(e.target.value)} id="address" className="bg-transparent focus:outline-none w-36 lg:w-40">
                        <option value="">Location</option>
                        <option value="patna">Patna</option>
                        <option value="bhagalpur">Bhagalpur</option>
                        <option value="muzaffarpur">Muzaffarpur</option>
                        <option value="gaya">Gaya</option>
                        <option value="vaishali">Vaishali</option>
                    </select> 
                    
                    
                    <select name="type" id="type" onChange={(e) => setRent_Sale(e.target.value)} className=" bg-transparent focus:outline-none w-36 lg:w-40" >
                        <option value="">Choose</option>
                        <option value="rent">Rental</option>
                        <option value="sale">Purchase</option>
                        
                    </select> 
                    <button type="submit" className="bg-slate-700 p-3 rounded-lg mx-2">
                        
                    <FaSearch  className='text-slate-100 cursor-pointer ' />
                    </button>
                </form>
    </div>
    </div>
  )
}
