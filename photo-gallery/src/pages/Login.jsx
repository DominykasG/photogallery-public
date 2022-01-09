import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { login } from '../reducers/user';
import Footer from '../components/Footer';

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginValue, setLoginValue] = useState({
        username:"",
        password:""
    });

    function handleLoginChange(v) {
        const { id, value } = v.target
        setLoginValue({...loginValue, [id]:value});
    }
    async function handleLoginClick(){
        if(loginValue.username !== "" && loginValue.password !== ""){;
            await dispatch(login(loginValue));
            navigate("/");
        }
    }
    return (
        <div className="flex flex-col flex-grow w-screen content-center align-middle justify-center items-center">
            <form className="w-3/4 md:w-2/5 lg:w-1/5 flex-grow flex flex-col justify-center">
                <div className="md:flex md:items-center mb-6">
                    <h1 className="text-3xl">Login</h1>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleLoginChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="username" type="text" placeholder="username"/>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleLoginChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="password" type="password" placeholder="password"/>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <button onClick={handleLoginClick}className="shadow bg-purple-500 hover:bg-purple-400 w-full h-8 focus:shadow-outline focus:outline-none text-white rounded-lg text-center" type="button">
                        Login
                    </button>
                </div>
                <div>
                    <h1>Don't have an account?  <Link to="/register" className="text-purple-600">Sign Up</Link></h1>
                </div>
            </form>
            <Footer/>
        </div>
    )
}
