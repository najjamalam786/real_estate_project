import React, { useEffect, useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";




export default function UpdateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        regularPrice: 0,
        discountPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        type: "sale",
        offer: false,
        furnished: false,
        parking: false,
        userRef: ""
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filePercent, setFilePercent] = useState(0);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();



    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json();

            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };

        fetchListing();

    }, []);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promisesImg = [];

            for (let i = 0; i < files.length; i++) {
                // all the "downloadURL" store in "promisesImg"
                promisesImg.push(storeImage(files[i]));
            }
            Promise.all(promisesImg)
                .then((urls) => {
                    // "concat" method add new one "url" to the privious one (imageUrls: kind of array)
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError("Image upload failed (3MB max per image)");
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                // add that snapshot, even we don't want to add the promise
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFilePercent(Math.round(progress));

                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            // instead of "url" is "_" for filter "remove"
            imageUrls: formData.imageUrls.filter((_, idx) => idx !== index),
        });
    };

    const handleChange = (e) => {

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }

        if (e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // if we don't have any image don't submit form
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image');

            // regular price less than discount price give error and some time this is string or number, use "+" fixed in number
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');


            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            }

            navigate(`/listing/${data._id}`)

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }




    return (
        <>
            <main className="p-3 max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-center my-7">
                    Create a Listing
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1">
                        <input
                            type="text"
                            placeholder="Name"
                            className="border p-3 rounded-lg"
                            id="name"
                            maxLength={62}
                            minLength={10}
                            onChange={handleChange}
                            value={formData.name}
                            required
                        />
                        <textarea
                            type="textarea"
                            placeholder="Description"
                            className="border p-3 rounded-lg"
                            id="description"
                            onChange={handleChange}
                            value={formData.description}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            className="border p-3 rounded-lg"
                            id="address"
                            onChange={handleChange}
                            value={formData.address}
                            required
                        />

                        <div className="flex gap-6 flex-wrap">
                            <div className="flex gap-2">
                                <input type="checkbox" id="sale" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.type === 'sale'} />
                                <span>Sell</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" id="rent" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.type === 'rent'} />
                                <span>Rent</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" id="parking" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.parking} />
                                <span>Parking spot</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" id="furnished" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.furnished} />
                                <span>Furnished</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" id="offer" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.offer} />
                                <span>Offer</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="bedrooms"
                                    min="1"
                                    max="10"
                                    onChange={handleChange}
                                    value={formData.bedrooms}
                                    required
                                    className="p-3 border-gray-300 rounded-lg"
                                />
                                <p>Beds</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="bathrooms"
                                    min="1"
                                    max="10"
                                    onChange={handleChange}
                                    value={formData.bathrooms}
                                    required
                                    className="p-3 border-gray-300 rounded-lg"
                                />
                                <p>Baths</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="regularPrice"
                                    min="0"
                                    required
                                    className="p-3 border-gray-300 rounded-lg"
                                    onChange={handleChange}
                                    value={formData.regularPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Regular Price</p>
                                    <span className="text-xs">
                                        {formData.type === 'rent' ? "{ $/month }" : "{ $amount }"}

                                    </span>
                                </div>
                            </div>
                            {formData.offer && <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="discountPrice"
                                    min="0"
                                    required
                                    className="p-3 border-gray-300 rounded-lg"
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discount Price</p>
                                    <span className="text-xs">($ / month)</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-4">
                        <p className="font-semibold">
                            Images:
                            <span className="font-normal text-gray-600 ml-2">
                                The first image will be the cover (max 6 and less than 3MB)
                            </span>
                        </p>
                        <div className="flex gap-4">
                            <input
                                onChange={(e) => setFiles(e.target.files)}
                                type="file"
                                className="p-3 border border-gray-300 rounded w-full"
                                id="images"
                                accept="image/+"
                                multiple
                            />

                            <button
                                disabled={uploading}
                                type="button"
                                onClick={handleImageSubmit}
                                className="p-3 text-green-700 border border-green-700 rounded uupercase hover:shadow-lg disabled:opacity-80"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>

                        {uploading && <p className="text-green-700 text-sm">Upload is ${filePercent}% done</p>}

                        <p className="text-red-700 text-sm">
                            {imageUploadError && imageUploadError}
                        </p>
                        {formData.imageUrls.length > 0 &&
                            formData.imageUrls.map((url, index) => (
                                <div
                                    key={url}
                                    className="flex justify-between p-3 border items-center"
                                >
                                    <img
                                        src={url}
                                        alt="listing image"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="text-red-700 text-sm font-semibold uppercase p-3 hover:opacity-55"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                        

                        <button
                            type="submit"
                            // protect un-necessary click use "disable={loading || uploading}"
                            disabled={loading || uploading}
                            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-90"
                        >
                            {loading ? 'Update...' : 'Update List'}
                        </button>



                        {error && <p className="text-red-700 text-sm">{error}</p>}
                    </div>
                </form>
            </main>
        </>
    );
}
