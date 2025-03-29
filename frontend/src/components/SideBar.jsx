import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useAuth } from '../utils/AuthContext'

export default function MainPage() {
  const nav = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }
  return (
    <>
      <nav className='bg-[#1D3557] text-white fixed top-0 left-0 z-50 h-full w-32 shadow-xl rounded-r-2xl hidden sm:block'>
        <ul className='flex flex-col items-center py-5 space-y-6'>
          {/* large screens */}
          <li className='cursor-pointer font-semibold hover:scale-105 active:scale-95 duration-300'>
            <Link to="/main">Home</Link>
          </li>

          {!localStorage.getItem("token") &&
            <li className='cursor-pointer font-semibold hover:scale-95 active:scale-90 duration-300'>
              <Link to="/login">Login</Link>
            </li>
          }

          <li className='cursor-pointer font-semibold hover:scale-95 active:scale-90 duration-300'>
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </nav>

      {/* small screens */}
      <div className="sm:hidden absolute top-4 left-4 z-150">
        <button onClick={toggleMenu} className="active:scale-90 duration-300">
          {isOpen ? <IoIosClose size={50} className='text-white' /> : <IoIosMenu size={50} />}
        </button>
      </div>

      {/* open menu when clicked */}
      <div onClick={() => { setIsOpen(!isOpen) }} className={`text-center sm:hidden fixed top-0 left-0 bg-[#1D3557]/95 w-full h-full
         text-white z-100 flex justify-center items-center text-4xl transition-all duration-500 ease-in-out transform
         ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <ul>
          <li className='mb-10 hover:scale-105 cursor-pointer active:scale-95 duration-150'>
            <Link to="/">Home</Link>
          </li>

          {!localStorage.getItem("token") &&
            <li className='mb-10 hover:scale-105 cursor-pointer active:scale-95 duration-150'>
              <Link to="/login">Login</Link>
            </li>
          }

          <li className='mb-10 hover:scale-105 cursor-pointer active:scale-95 duration-150'>
            <button onClick={() => { localStorage.removeItem("token"); nav("/login"); setIsOpen(!isOpen) }}>Log Out</button>
          </li>
        </ul>
      </div>
    </>
  )
}
