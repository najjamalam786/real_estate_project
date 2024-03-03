import React from 'react'

export default function Search_Result() {
    return (

        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2'>
                <form className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <lable className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </lable>

                        <input
                            type="text"
                            className='border rounded-lg p-3 w-full' id="searchTerm"
                            placeholder='Search'
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <lable className='font-semibold'>
                            Type:
                        </lable>


                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'

                            />
                            <span >Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'

                            />
                            <span >Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'

                            />
                            <span >Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="all"
                                className='w-5'

                            />
                            <span >offer</span>
                        </div>
                        
                    </div>

                    <div className='flex gap-2 flex-wrap items-center'>
                        <lable className='font-semibold'>
                            Amenities:
                        </lable>


                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="parking"
                                className='w-5'

                            />
                            <span >Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id="furnished"
                                className='w-5'

                            />
                            <span >Furnished</span>
                        </div>
                    
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap
                        font-semibold'>Sort:</label>
                        <select 
                        className='border rounded-lg p-3 w-full'
                        name="sort" 
                        id="sort_order"
                        >
                            <option value="high price">Price high to low</option>
                            <option value="low price">Priced low to high</option>
                            <option value="">Latest</option>
                            <option value="">Older</option>
                        </select>

                    </div>

                    <div className="flex gap-2">
                        <button className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95">Search</button>
                    </div>

                </form>
            </div>
            <div>
                <h1 className='text-3xl text-slate-700 mt-5 font-semibold border-b p-3 '>Listing Results</h1>
            </div>
        </div>
    )
}
