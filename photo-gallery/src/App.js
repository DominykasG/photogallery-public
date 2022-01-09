import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Home from './pages/Home';

function App() {
  return (
    <div className="flex flex-col h-full">
      <BrowserRouter>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/profile/:username" element={<Profile/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;