
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);


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

  // const handleFileUpload = (file) => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + file.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on('state_changed',
  //   (snapshot) => {
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     setFilePercent(Math.round(progress));
  //   },

  //   (error) => {
  //     setFileUploadError(true);
  //   },
  //   () => {
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //     setFormData({ ...formData, avatar: downloadURL })});
  //   },
  //   );
  // }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profil</h1>
      <form className='flex flex-col gap-4'>

        {/* choose file and then open system files using "fileRef.current.click()" function*/}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' hidden />


        {/* and also open system files using "fileRef.current.click()" function call input type='file' */}
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (<span className='text-red-700 '>Error Image upload (image must be less than 2MB)</span>)
            :
            filePercent > 0 && filePercent < 100 ?
              (<span className='text-slate-700' >{`Uploading ${filePercent}%`}</span>)
              :
              filePercent === 100 ?
                (<span className='text-green-700'>Image Successful Uploade!</span>)
                : (" ")
          }
        </p>

        <input className='border p-3 rounded-lg' type="text" placeholder='username' id='username' />
        <input className='border p-3 rounded-lg' type="email" placeholder='email' id='email' />
        <input className='border p-3 rounded-lg' type="password" placeholder='password' id='password' />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>Update</button>

      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>

      </div>
    </div>
  )
}
