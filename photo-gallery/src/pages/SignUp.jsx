import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { register } from '../reducers/user';
import Footer from '../components/Footer';

export default function SignUp() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [registerValue, setRegisterValue] = useState({
        username:"",
        email: "",
        password:"",
        confirmPassword: ""
    });

    function handleSignUpChange(v) {
        const { id, value } = v.target
        setRegisterValue({...registerValue, [id]:value});
    }
    async function handleSignUpClick(){
        if((registerValue.username !== "" && registerValue.email !== "" && registerValue.password !== "" && registerValue.confirmPassword !== "") && (registerValue.password === registerValue.confirmPassword)){
            await dispatch(register({username: registerValue.username, email: registerValue.email, password: registerValue.password}))
            navigate("/login")
        }
    }
    return (
        <div className="flex flex-col flex-grow w-screen content-center align-middle justify-center items-center">
            <form className="w-3/4 md:w-2/5 lg:w-1/5 flex-grow flex flex-col justify-center">
                <div className="md:flex md:items-center mb-6">
                    <h1 className="text-3xl">Sign Up</h1>
                </div>
                <div class="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleSignUpChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="username" type="text" placeholder="username"/>
                </div>
                <div class="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleSignUpChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="email" type="text" placeholder="example@example.com"/>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleSignUpChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="password" type="password" placeholder="password"/>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <input onChange={(e) => handleSignUpChange(e)} className="bg-white appearance-none border border-black rounded-lg w-full h-8 px-2 text-black focus:outline-none focus:bg-white focus:border-purple-500" id="confirmPassword" type="password" placeholder="confirm password"/>
                </div>
                <div class="md:flex md:items-center">
                    <button onClick={() => handleSignUpClick()} className="shadow bg-purple-500 hover:bg-purple-400 w-full h-8 focus:shadow-outline focus:outline-none text-white rounded-lg text-center" type="button">
                        Sign Up
                    </button>
                </div>
            </form>
            <Footer/>
        </div>
    )
}
