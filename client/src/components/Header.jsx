import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"
import { useSelector } from 'react-redux';
import Logo from '../assets/home.png';

export default function Header() {

    const {currentUser} = useSelector(state => state.user);
    const [searchInput, setSearchInput] = useState('');
    const [locations, setLocations] = useState(false);
    const navigate = useNavigate();


    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        if(searchInput){
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('searchTerm', searchInput);
            const searchQuery = urlParams.toString();
            
            
            navigate(`/search?${searchQuery}`);
            
        }
        
    }
    
    
    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        // get search term from url
        const pathname = window.location.pathname;

        {pathname === '/' ? setLocations(true) : setLocations(false);}
        
        if(searchTermFromUrl){
            setSearchInput(searchTermFromUrl);
        }
        // condition set on search path
    }, [location.search]);




    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/' className='flex items-end gap-1'>
                <img src={Logo} className='w-8' alt="Logo" />
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap mt-4'>
                        
                        <span className='text-slate-500'>Property</span>
                        <span className='text-slate-700'>Zone</span>
                    </h1>
                </Link>

                {locations ? " " : (
                <form onSubmit={handleSearchSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button type="submit">
                    <FaSearch  className='text-slate-600 cursor-pointer' />
                    </button>
                </form>
                )}

                <ul className='flex gap-4'>
                    <Link to="/"><li className='hidden sm:inline text-slate-700 hover:underline'>
                        Home
                    </li></Link>
                    <Link to="/about"><li className='hidden sm:inline text-slate-700 hover:underline'> About</li></Link>
                    

                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile_img'/>
                        ) : (<li className='text-slate-700 hover:underline'>Sign In</li>)}
                    </Link>
                </ul>
            </div>
        </header>
    )
}
