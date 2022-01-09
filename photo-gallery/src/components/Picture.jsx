import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router';
import Modal from 'react-modal';
import { addUserComment, deleteUserComment } from '../reducers/comments';
import { Link } from 'react-router-dom';
import { deletePhoto, getUserScore, ratePhoto, getUserPhotos, getAllPhotos } from '../reducers/photos';

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
        width: '80%',
        maxWidth: '60rem',
    },
};
  
export default function Picture(props) {
    const [commentValue, setCommentValue] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [dateValue, setDate] = useState({
        date: "",
        ago: ""
    });

    const user = props.user
    const image = props.img
    const params = useParams();

    const loggedInUser = useSelector((state) => state.user.userData);
    const role = useSelector((state) => state.user.role);
    const score = useSelector((state) => state.photos.score);

    const inputEl = useRef(null);

    const dispatch = useDispatch();

    function openModal() {
        setIsOpen(true);
        dateDifference();
        dispatch(getUserScore(image.id));
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleCommentChange(v) {
        const { value } = v.target;
        setCommentValue({...commentValue, value});
    }
    async function handlePostCommentClick()
    {   
        await dispatch(addUserComment({content: commentValue.value, photoId: image.id}))
        refreshPhotos();
    }
    async function handleDeleteCommentClick(id)
    {
        await dispatch(deleteUserComment(id));
        refreshPhotos();
    }
    async function onLikeButtonClick(id){
        await dispatch(ratePhoto({id: id, value: +!score}));
        refreshPhotos();
        await dispatch(getUserScore(image.id));
    };
    function onCommentButtonClick(){
        inputEl.current.focus();
    };
    async function onDeleteButtonClick(id){
        await dispatch(deletePhoto(id));
        refreshPhotos();
    };
    function dateDifference()
    {
        const photoDate = new Date(image.createAt)
        const now = new Date()
        if((now.getFullYear() - photoDate.getFullYear()) !== 0){
            setDate({date: (photoDate.toLocaleString('default', { month: 'long' }) + " " + photoDate.getDay() + " " + photoDate.getFullYear()), ago: ""})               
        }else if((now.getMonth() - photoDate.getMonth()) !== 0){
            setDate({date: (photoDate.toLocaleString('default', { month: 'long' }) + " " + photoDate.getDay()), ago: ""})
        }else if((now.getUTCDate() - photoDate.getUTCDate()) !== 0){
            const date = (now.getUTCDate() - photoDate.getUTCDate())
            if(date > 1){
                setDate({date: date, ago: "DAYS AGO"})
            }else{
                setDate({date: date, ago: "DAY AGO"})
            }
        }else{
            const date = (now.getHours() - photoDate.getHours())
            if(date > 1){
                setDate({date: date, ago: "HOURS AGO"})
            }else if(date === 1){
                setDate({date: date, ago: "HOUR AGO"})
            }else{
                const date = (now.getMinutes() - photoDate.getMinutes())
                setDate({date: date, ago: "MINUTES AGO"})
            }
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
    console.log(commentValue.value)
    return (
        <>
            <div onClick={openModal} className="col-span-1 square post rounded-lg shadow">
                <img src={image.url} className="content w-full h-full rounded-lg object-cover object-center" alt="img"/>
                <div class="rounded-lg bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 opacity-0 hover:opacity-100 duration-200 text-white ease-in-out">
                    <div class="flex justify-center items-center space-x-4 h-full">
                        <span class="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </span>
                        {image.photoScores? image.photoScores.reduceRight((scoreSum, y) => scoreSum + y?.value, 0) : 0}  
                        <span class="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7" clipRule="evenodd" />
                            </svg>
                        </span>
                        {image.comments? image.comments.length : "0"}  
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="container grid grid-cols-7">
                    <div className="col-span-4">
                        <img src={image.url} className="w-full h-full object-fit object-center" alt="img"/>
                    </div>
                    <div className="col-span-3">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-between items-center">
                                <img className="rounded-full my-3 mx-3" src={user && user.imageUrl} alt="profile-pic" width="42" height="42"/>  
                                <h1 className="flex-grow">
                                    <Link to={`/profile/${user?.username && user?.username}`}>{user?.username}</Link>
                                    <h1 className="text-xs">{image?.category}</h1>
                                </h1>           
                                <button className="mr-3" onClick={closeModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>   
                            </div>
                            <div className="border-t"/>
                            <div className="flex-grow overflow-y-auto h-1 no-scrollbar">
                                {image.comments && image.comments?.map((comment) => 
                                    <div className="flex flex-between items-start">
                                        <img className="rounded-full my-3 mx-3" src={comment.user && comment.user.imageUrl} alt="profile-pic" width="42" height="42"/>
                                        <div className="flex-grow break-all my-5">
                                            <Link to={`/profile/${comment.user && comment.user.username}`} className="mr-2 font-semibold">{comment.user && comment.user.username}</Link>
                                            {comment.content}
                                        </div>
                                        {(loggedInUser?.aspNetUserId === comment?.userId || role == "Admin") &&
                                        <button onClick={() => handleDeleteCommentClick(comment.id)} className="my-5 mx-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>}
                                    </div>
                                )}
                            </div>
                            <div className="border-t"/>
                            <div className="flex">
                                <button onClick={() => onLikeButtonClick(image.id)} class="pl-3 py-2 hover:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${score !== 0 ? "text-purple-500" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />        
                                    </svg>
                                </button>  
                                <button onClick={onCommentButtonClick} class="pl-3 hover:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </button>
                                {(loggedInUser?.aspNetUserId === image?.userId || role == "Admin") &&
                                <button onClick={() => onDeleteButtonClick(image.id)} class="pl-3 hover:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                }
                            </div>
                            <div className="px-3 pb-2">
                                <div>{image.photoScores? image.photoScores.reduceRight((scoreSum, y) => scoreSum + y?.value, 0) : 0}  likes</div>
                                <div className="text-gray-400 text-xs tracking-tighter">{dateValue.date} {dateValue.ago}</div>
                            </div>
                            <div className="border-t"/>
                            <div className="flex">
                                <input onChange={(e) => handleCommentChange(e)} class="appearance-none w-full py-2 px-3 focus:outline-none" id="comment" type="text" ref={inputEl} placeholder="Add a comment..."/>
                                <button disabled={!commentValue.value} onClick={handlePostCommentClick} className="i text-sm px-4 py-2 leading-none text-purple-500 mr-3">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}