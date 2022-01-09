import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch} from 'react-redux'
import { Link } from 'react-router-dom';
import { logout } from '../reducers/user';
import Drawer from './Drawer';

export default function Navbar() {
    const [navBarOpen, setNavBarOpen] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    return (
        <header>
            <nav className="flex items-center justify-between flex-wrap bg-purple-400 p-3 h-16">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <Link to="/" className="text-3xl">Photo Gallery</Link>
                </div>
                <div className="block lg:hidden">
                    <button className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-purple-400 hover:border-white hover:bg-white" onClick={() => setNavBarOpen(!navBarOpen)}>
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                    </button>
                </div>
                <div className="w-full lg:flex lg:items-center lg:w-auto hidden">
                    <div className="text-sm lg:flex-grow">
                    {user?.isLoggedIn
                        ?<> 
                        <Link to={`/profile/${user.userData?.username}`} className="text-sm px-4 py-2 leading-none rounded text-white mt-4 mr-4 lg:mt-0">
                            <img className="rounded-full inline-block mr-3 border-2 border-white" src={user?.userData && user.userData?.imageUrl} alt="profile-pic" width="42" height="42"/>
                            {user?.userData && user.userData?.username}
                        </Link>
                        <button onClick={() => {dispatch(logout()); navigate("/")}} className="inline-block text-sm px-4 py-2 leading-none rounded text-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 mr-4 lg:mt-0">Logout</button>
                        </>
                        :<>
                        <Link to="login" className="inline-block text-sm px-4 py-2 leading-none rounded text-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 mr-4 lg:mt-0">Login</Link>
                        <Link to="signup" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 mr-4 lg:mt-0">Sign Up</Link>
                        </>
                    }
                    </div>
                </div>
            </nav>
            <Drawer drawerOpen={navBarOpen} setDrawerOpen={() => setNavBarOpen(false)}/>
        </header>
    )
}
