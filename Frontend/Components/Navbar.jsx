import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Navbar = () => {


  useEffect(()=>{
    if(!Cookies.get('authToken')){
      navigate("/login")
    }
  },[])

  const authToken = Cookies.get('authToken');
  const navigate = useNavigate()
  const logout=()=>{
    localStorage.removeItem('user');
    Cookies.remove('authToken');
    navigate("/login");
  }

  return (
    <div className='w-full font-semibold text-white flex items-center justify-between px-6 py-2 h-[12vh] bg-blue-400'>
        <div className=''>
            Project Maager
        </div>
        <div className='flex gap-x-4'>
            <Link to="/">Allocate Teams</Link>
            <Link to="/view-teams">View Teams</Link>
            <Link to="/evaluate-teams">Evaluate Teams</Link>
            <span className='cursor-pointer' onClick={logout}>Logout</span>
        </div>
    </div>
  )
}

export default Navbar