
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { deleteFailure, deleteSuccess, deleteUserStart, signoutUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../app/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if request.resource.size < 2 * 1024 * 1024
  //                  && request.resource.contentType.matches('image/.*');
  // allow read, write: if request.auth != null;

  // use for upload only image file in firebase storage
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',

      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));
      },
    );

  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e) => {
    console.log(error);
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data));

    } catch (error) {
      dispatch(deleteFailure(error.message))
    }
  }

  const handleSignOut = async () => {

    try {
      dispatch(signoutUserStart())
      const res = await fetch('/api/user/signout');
      const data = await res.json();

      console.log(data);

      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data));

    } catch (error) {
      dispatch(deleteFailure(error.message))
    }
  }

  const handleShowListing = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      showListingError(true);
    }
  }

  const handleListingDelete = async (listindId) => {

    try {
      const res = await fetch(`/api/listing/delete/${listindId}`, {
        method: "DELETE",

      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== listindId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profil</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* choose file and then open system files using "fileRef.current.click()" function*/}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' hidden />


        {/* and also open system files using "fileRef.current.click()" function call input type='file' */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (<span className='text-red-700 '>Error Image upload (image must be less than 3MB)</span>)
            :
            filePercent > 0 && filePercent < 100 ?
              (<span className='text-slate-700' >{`Uploading ${filePercent}%`}</span>)
              :
              filePercent === 100 ?
                (<span className='text-green-700'>Image Successful Uploade!</span>)
                : (" ")
          }
        </p>

        <input className='border p-3 rounded-lg' type="text" placeholder='username' defaultValue={currentUser.username} id='username' onChange={handleChange} />
        <input className='border p-3 rounded-lg' type="email" placeholder='email' defaultValue={currentUser.email} id='email' onChange={handleChange} />
        <input className='border p-3 rounded-lg' type="password" placeholder='password' id='password' onChange={handleChange} />

        <button disabled={loading} type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>{loading ? 'Loading' : 'Update Profile'}</button>


        <Link to='/create-listing' className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95 text-center">Create Listing
        </Link>

      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 font-semibold cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 font-semibold cursor-pointer'>
          Sign out
        </span>

      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'> {updateSuccess ? "Profile Updated Successfully!" : ""}</p>

      <button onClick={handleShowListing} className="text-green-700 mt-4 w-full font-semibold hover:opacity-55">
        Show Listing
      </button>
      <p className='text-red-700 mt-5'>{showListingError ? "Error showing listing" : ""}</p>

      {userListing &&
        userListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-4 text-2xl font-semibold">Your Listing</h1>

          {userListing.map((listing) => (

            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">

              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} className="max-h-36 max-w-36 object-contain rounded-lg" alt='listingImage' />
              </Link>

              <Link to={`/listing/${listing._id}`}>
                <p className="text-slate-700 w-40 font-semibold flex-1 hover:underline truncate">{listing.name}</p>
              </Link>

              <div className="flex flex-col gap-5 items-start">

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>

                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>


              </div>
            </div>

          ))}

        </div>

      }

    </div>
  )
}

// css "truncate" use to long string like "ajsjfj......"
