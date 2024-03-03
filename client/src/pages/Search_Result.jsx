import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search_Result() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: '',
        offer: '',
        furnished: '',
        parking: '',
        sort: 'createAt',
        order: 'desc',

    });
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);

console.log(listings);


    useEffect(() => {
        
        const urlParams = new URLSearchParams(location.search);

        

        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const furnishedFromUrl = urlParams.get('furnished');
        const parkingFromUrl = urlParams.get('parking');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            furnishedFromUrl ||
            parkingFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                offer: offerFromUrl || 'true' ? true : false,
                furnished: furnishedFromUrl || 'true' ? true: false,
                parking: parkingFromUrl || 'true' ? true: false,    
                sort: sortFromUrl || 'createAt',
                order: orderFromUrl || 'desc',

            })
        }


        const fetchListing = async () => {
            try{
                
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${searchQuery}`)

                const data = await res.json();

                if(data.success === false){
                    return console.log(data.message);
                }

                setListings(data);
                setLoading(false);
            }catch(err){
                console.log(err);
            }
        }
        fetchListing();
        

    }, [location.search]);
    
    const handleChange = (e) => {
        
        if(e.target.id === "all" || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebarData({
                ...sidebarData,
                type: e.target.id,
            })
        }

        if(e.target.id === 'searchTerm'){
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            })
        }

        if(e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === 'offer'){
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
            })
        }

        if(e.target.id === 'sort_order'){

            const sort = e.target.value.split('_')[0] || 'createAt';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({
                ...sidebarData,
                sort,
                order, 
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('offer', sidebarData.offer)   
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    return (

        <div className='flex flex-col md:flex-row'>
            
            <div className='p-7 border-b-2 md:border-r-2'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </label>

                        <input
                            type="text"
                            className='border rounded-lg p-3 w-full' 
                            id="searchTerm"
                            placeholder='Search'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>
                            Type:
                        </label>


                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'

                                onChange={handleChange}
                                checked={sidebarData.type === 'all'}

                            />
                            <span >Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="rent"
                                className='w-5'
                                
                                onChange={handleChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <span >Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="sale"
                                className='w-5'

                                onChange={handleChange}
                                checked={sidebarData.type === 'sale'}

                            />
                            <span >Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="offer"
                                className='w-5'

                                onChange={handleChange}
                                checked={sidebarData.offer}

                            />
                            <span >offer</span>
                        </div>
                        
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>
                            Amenities:
                        </label>


                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="parking"
                                className='w-5'

                                onChange={handleChange}
                                checked={sidebarData.parking}

                            />
                            <span >Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="furnished"
                                className='w-5'

                                onChange={handleChange}
                                checked={sidebarData.furnished}

                            />
                            <span >Furnished</span>
                        </div>
                    
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap
                        font-semibold'>Sort:</label>
                        <select 
                        onChange={handleChange}
                        defaultValue={'created_at_desc'}
                        className='border rounded-lg p-3 w-full'
                        name="sort" 
                        id="sort_order"
                        >
                            <option value="regulaPrice_desc">Price high to low</option>
                            <option value="regulaPrice_asc">Priced low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Older</option>
                        </select>

                    </div>

                    <div className="flex gap-2">
                        <button type='submit' className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 w-full">Search</button>
                    </div>

                </form>
            </div>
            <div>
                <h1 className='text-3xl text-slate-700 mt-5 font-semibold border-b p-3 '>Listing Results</h1>
            </div>
        </div>
    )
}
