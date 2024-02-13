import { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    });
    // console.log(formData);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
        setLoading(true);
      
      const res = await fetch('/api/user/signin', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      e.target.reset();
      
      if(data.success === false) {
        setLoading(false);
        setError(data.Message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/');

    }catch(error){
      setError(error.message);
      setLoading(false)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7' >
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input type="email" placeholder='email' className='border p-3 rounded-lg' id="email" onChange={handleChange}/>

        <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password" onChange={handleChange} />

        <button disabled={loading} type='submit' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>{loading ? "Loaging..." : "Sign In"}</button>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have any account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700' >Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}
