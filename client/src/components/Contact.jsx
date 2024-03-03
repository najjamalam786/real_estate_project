import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            }    catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [listing.userRef]);

  return (
    <>
    {landlord !== null && (
        <div className='flex flex-col gap-2'>
            <p className='font-semibold'>
                Contact 
                <span className='font-semibold'> {landlord?.username} </span>
                for 
                <span className='text-red-500 uppercase font-semibold'> {listing.name.toLowerCase()}</span>
            </p>
            <textarea name="message" id="message" rows="2" className="w-full border p-3 rounded-lg mt-2" onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message here"></textarea>

            <Link to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}  >
                <button type="button" className="bg-slate-700 text-white uppercase w-full  rounded-lg p-3 mt-4 font-semibold hover:bg-slate-600">Send Message</button></Link>
        </div>
    )}
    </>
  )
}
