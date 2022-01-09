import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { getAllPhotos } from '../reducers/photos';
import Picture from '../components/Picture';

export default function Home() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllPhotos())
    }, [dispatch])

    const photos = useSelector((state) => state.photos.photos);
    console.log(photos)
    return (
        <div className="lg:w-8/12 lg:mx-auto pb-8 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-4 lg:gap-x-4 mt-5 mx-3 lg:mx-0">
                {photos && photos?.map((photo) => <Picture img={photo} user={photo.user}/>)}
            </div>
        </div>
    )
}
