import { useState } from 'react'
import { Link } from "react-router-dom";

export default function SignIn() {

  const [] = useState();
  return (
    <div>
      <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7' >
        Sign In
      </h1>
      <form className='flex flex-col gap-4'>

        <input type="email" placeholder='email' className='border p-3 rounded-lg' id="email" />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password" />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>Sign in</button>
        <button type='submit' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>continuoue with google</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have any account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700' >Sign up</span>
        </Link>
      </div>
    </div>
    </div>
  )
}

