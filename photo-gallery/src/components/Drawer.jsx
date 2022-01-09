import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom';
import { logout } from '../reducers/user';

export default function Drawer(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    function logoutDrawer(){
        dispatch(logout());
        props.setDrawerOpen();
        navigate('/');
    }
    return (
        <nav className={"bg-purple-400 w-3/4 h-screen absolute z-10 flex flex-col justify-between left-0 top-0 transform transition duration-200 ease-in-out lg:-translate-x-full " + (props.drawerOpen ? "" : "-translate-x-full")}>
            <div className="flex items-center flex-shrink-0 text-white px-3 h-16 justify-between">
                <Link onClick={() => props.setDrawerOpen()}to={`/profile/${user.userData?.username}`} className="text-sm px-4 py-2 leading-none rounded text-white mt-4 mr-4 lg:mt-0 flex-grow">
                    <img className="rounded-full inline-block mr-3 border-2 border-white" src={user?.userData && user.userData?.imageUrl} alt="profile-pic" width="52" height="52"/>
                    {user?.userData && user.userData?.username}
                </Link>
                <button onClick={() => props.setDrawerOpen()} className="mt-4" type="button" >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col">
                {user.isLoggedIn
                    ?<>
                        <button className="flex text-sm px-3 py-2 rounded text-white hover:border-transparent hover:text-purple-500 hover:bg-white justify-between" onClick={() => logoutDrawer()}>
                            <div>
                                Logout
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </>
                    :<>
                    <Link to="login" className="flex text-sm px-3 py-2 rounded text-white hover:border-transparent hover:text-purple-500 hover:bg-white justify-between" onClick={() => props.setDrawerOpen()}>
                        <div>
                            Login
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                    <Link to="signup" className="flex text-sm px-3 py-2 rounded text-white hover:border-transparent hover:text-purple-500 hover:bg-white justify-between" onClick={() => props.setDrawerOpen()}>
                        <div>
                            Sign Up
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </Link>
                    </>
                }
            </div>
        </nav>
    )
}
