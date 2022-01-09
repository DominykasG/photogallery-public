import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkLogin } from '../reducers/user';

export default function AuthProvider(props) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    
    useEffect(() => {
        if(isLoggedIn){
            dispatch(checkLogin())
        }
    }, [isLoggedIn, dispatch])

    return (
        <>
            {props.children}
        </>
    )
}
