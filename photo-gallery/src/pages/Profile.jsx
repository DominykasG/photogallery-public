import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router';
import Picture from '../components/Picture';
import { addPhoto, getUserPhotos, getAllPhotos } from '../reducers/photos';
import { getUser, updateUser } from '../reducers/user';
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
    },
    content: {
        borderRadius: '4px',
        border: '0',
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        padding: '0rem',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        minWidth: '20rem',
        width: '25%',
        maxWidth: '60rem',
    },
};

export default function Profile() {
    const dispatch = useDispatch()
    const params = useParams();

    const loggedInUser = useSelector((state) => state.user);
    const photos = useSelector((state) => state.photos.photos);
    const user = useSelector((state) => state.user.userProfile);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [profileModalIsOpen, setProfileIsOpen] = useState(false);
    const [photoValue, setPhotoValue] = useState("");
    const [userData, setUserData] = useState({
        name: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        dispatch(getUser(params.username))
        dispatch(getUserPhotos(params.username));
    }, [dispatch, params.username])

    useEffect(() => {
        if(user && loggedInUser.userData){
            setUserData({imageUrl:loggedInUser.userData.imageUrl, username:loggedInUser.userData.username, name: user.name, title: user.title, description: user.description})
        }
    }, [user, loggedInUser.userData])

    function openPictureModal() {
        setIsOpen(true);
    }
    function closePictureModal() {
        setIsOpen(false);
    }
    function openProfileModal() {
        setProfileIsOpen(true);
    }
    function closeProfileModal() {
        setProfileIsOpen(false);
    }
    function handlePhotoChange(v) {
        const {id, value} = v.target;
        setPhotoValue({...photoValue, [id]:value});
    }
    function handleUserChange(v)
    {
        const { id, value } = v.target
        setUserData({...userData, [id]:value});
    }
    async function handlePostClick(){
        if(photoValue.value !== "" || photoValue.value !== null){
            await dispatch(addPhoto({Url: photoValue.url, Category: photoValue.category}));
            refreshPhotos();
        }
    }
    async function handleUserClick()
    {
        if(userData.value || userData.title || userData.description){
            await dispatch(updateUser(userData))
            dispatch(getUser(params.username))
        }
    }
    function refreshPhotos()
    {
        if(params?.username)
        {
            dispatch(getUserPhotos(params.username));
        }else
        {
            dispatch(getAllPhotos())
        }
    }
    const likes = photos?.length > 0 ? photos.reduceRight((sum, x) => sum += x.photoScores.length > 0 ? x.photoScores.reduceRight((scoreSum, y) => scoreSum + y?.value, 0) : 0, 0) : 0;

    return (
        <div className="lg:w-8/12 lg:mx-auto pb-8 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 lg:gap-x-4 align-middle justify-center items-center p-4 md:p-0 md:py-8">
                <div className="col-span-1 flex justify-center">
                    <img className="w-20 h-20 md:w-40 md:h-40 rounded-full object-cover border-purple-500" src={user && user.imageUrl} alt="Profile"/>
                </div>
                <div className="w-8/12 md:w-7/12 ml-4 col-span-2">
                    <div className="md:flex md:flex-wrap md:items-center mb-4">
                        <h2 className="text-3xl inline-block font-light sm:mr-4 mb-2 sm:mb-0">{user && user.username}</h2>
                        {loggedInUser.userData?.username === user?.username && <button onClick={openProfileModal} className="inline-block text-sm px-4 py-2 leading-none border rounded text-purple hover:text-purple-500 hover:bg-white mt-4 mr-4 lg:mt-0">Edit Profile</button>}
                    </div>
                    <ul class="hidden md:flex space-x-8 mb-4">
                        <li>
                            <span class="font-semibold mr-1">{photos?.length}</span>
                            posts
                        </li>
                        <li>
                            <span class="font-semibold mr-1">{likes}</span>
                            likes
                        </li>
                    </ul>
                    <div class="hidden md:block">
                        {user?.name && <h1 class="font-semibold">{user.name}</h1>}
                        {user?.title && <span>{user.title}</span>}
                        {user?.description && <p>{user.description}</p>}
                    </div>
                </div>
            </div>
            <div className="border-t"/>
            <div className="grid grid-cols-3 gap-4 lg:gap-x-4 mt-5 mx-3 lg:mx-0">
                {loggedInUser.userData?.username === user?.username &&
                    <div onClick={openPictureModal} className="col-span-1 square shadow rounded-lg bg-gray-200">
                        <div className="content rounded-lg text-white hover:text-purple-400 ease-in-out duration-200 flex justify-center items-center cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <div class="rounded-lg bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 opacity-0 hover:opacity-100 duration-200 text-white ease-in-out"/>
                        </div>
                    </div>
                }
                {photos && photos?.map((photo) => <Picture img={photo} user={user} loggedInUser={loggedInUser}/>)}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closePictureModal}
                style={customStyles}
            >
                <div className="flex flex-col flex-grow content-center align-middle justify-center items-center my-3 ">
                    <form className="w-full">
                        <div className="text-center flex">
                            <h1 className="flex-grow ml-11">Add picture</h1>
                            <button className="mr-3" onClick={closePictureModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>  
                        </div>
                        <div className="border-t my-3 mb-9"/>
                        <label for="url" className="md:flex md:items-center mb-2 mx-4 font-semibold">Photo url</label>
                        <div className="md:flex md:items-center mb-2 mx-3">
                            <input onChange={handlePhotoChange} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="url" type="url" placeholder="Image url"/>
                        </div>
                        <label for="url" className="md:flex md:items-center mb-2 mx-4 font-semibold">Photo categories</label>
                        <div className="md:flex md:items-center mb-6 mx-3">
                            <select onChange={handlePhotoChange} className="bg-white border border-black rounded-lg w-full h-8 px-1 text-black focus:outline-none focus:bg-white focus:border-purple-500" name="categories" id="category">
                                <option value="">-</option>
                                <option value="Portrait">Portrait</option>
                                <option value="Photojournalisim">Photojournalism</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Sports">Sports</option>
                                <option value="Still life">Still Life</option>
                                <option value="Editorial">Editorial</option>
                                <option value="Architectural">Architectural</option>
                            </select>
                        </div>
                        <div className="flex items-center w-full justify-center">
                            <button onClick={handlePostClick} className="shadow bg-purple-500 hover:bg-purple-400 h-8 focus:shadow-outline focus:outline-none text-white rounded-lg text-center w-1/5" type="button">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={profileModalIsOpen}
                onRequestClose={closeProfileModal}
                style={customStyles}
            >
                <div className="flex flex-col flex-grow content-center align-middle justify-center items-center my-3 ">
                    <form className="w-full">
                        <div className="text-center flex">
                            <h1 className="flex-grow ml-11">Edit profile</h1>
                            <button className="mr-3" onClick={closeProfileModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>  
                        </div>
                        <div className="border-t my-3 mb-9"/>
                        <label for="imageUrl" className="md:flex md:items-center mb-2 mx-4 font-semibold">Name</label>
                        <div className="md:flex md:items-center mb-2 mx-3">
                            <input onChange={handleUserChange} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" value={userData.imageUrl} id="imageUrl" type="username" placeholder="https://example.com"/>
                        </div>
                        <label for="name" className="md:flex md:items-center mb-2 mx-4 font-semibold">Name</label>
                        <div className="md:flex md:items-center mb-2 mx-3">
                            <input onChange={handleUserChange} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" value={userData.name} id="name" type="username" placeholder="John Doe"/>
                        </div>
                        <label for="title" className="md:flex md:items-center mb-2 mx-4 font-semibold">Title</label>
                        <div className="md:flex md:items-center mb-2 mx-3">
                            <input onChange={handleUserChange} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" value={userData.title} id="title" type="username" placeholder="Example title"/>
                        </div>
                        <label for="description" className="md:flex md:items-center mb-2 mx-4 font-semibold">Bio</label>
                        <div className="md:flex md:items-center mb-6 mx-3">
                            <input onChange={handleUserChange} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" value={userData.description} id="description" type="username" placeholder="Example bio"/>
                        </div>
                        <div className="flex items-center w-full justify-center">
                            <button onClick={handleUserClick} className="shadow bg-purple-500 hover:bg-purple-400 h-8 focus:shadow-outline focus:outline-none text-white rounded-lg text-center w-1/5" type="button">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
