import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useAuth } from '../utils/AuthContext'
import { setTheme, initTheme } from "../utils/DarkMode"

export default function SideBar() {
  const { setIsAuthenticated, isAuthenticated, isAdmin, setIsAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [themeBtn, setThemeBtn] = useState(false)
  const location = useLocation()

  // Set theme mode
  initTheme()


  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setThemeBtn(true)
    } else {
      setThemeBtn(false)
    }
  }, [])

  const toggleMenu = () => setIsOpen(prev => !prev)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setIsAdmin(false)
    setIsOpen(false)
  }

  const navLinkClass = (path) =>
    `px-8 py-2 rounded font-medium transition ${location.pathname === path ? "bg-blue-600 text-white rounded-lg" : ""
    }`


  const handleThemeChange = () => {
    setThemeBtn(prev => {
      const newThemeState = !prev
      setTheme(newThemeState ? "dark" : "light")
      return newThemeState
    })
  }

  return (
    <>
      <nav className='bg-white text-gray-800 fixed top-0 left-0 z-50 h-full w-32 shadow-2xl hidden sm:flex flex-col justify-between py-6 dark:bg-zinc-800 transition-colors'>
        <ul className='flex flex-col items-center gap-6'>
          <li className='cursor-pointer font-medium hover:text-blue-600 transition dark:text-white'>
            <Link to="/home" className={` ${navLinkClass("/home")}`}>Home</Link>
          </li>
          <li className='cursor-pointer font-medium hover:text-blue-600 transition dark:text-white'>
            <Link to="/clients" className={navLinkClass("/clients")}>Clients</Link>
          </li>
          {isAdmin &&
            <li className='cursor-pointer font-medium hover:text-blue-600 transition dark:text-white'>
              <Link to="/users" className={navLinkClass("/users")}>Users</Link>
            </li>
          }
          <li className='cursor-pointer font-medium hover:text-blue-600 transition dark:text-white'>
            <Link to="/profile" className={navLinkClass("/profile")}>Profile</Link>
          </li>
        </ul>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-sm font-medium dark:text-white">Toggle Theme</h1>
          <button type='button' onClick={handleThemeChange} className={`w-13 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${themeBtn ? 'bg-blue-600' : 'bg-gray-300'}`}        >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${themeBtn ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          {isAuthenticated &&
            <div className='flex justify-center'>
              <button onClick={handleLogout} className='text-red-500 text-sm hover:underline transition'>Log Out</button>
            </div>
          }
        </div>
      </nav>

      <div className='sm:hidden p-5 bg-gray-300 dark:bg-neutral-800 transition-colors'>
        <div className="sm:hidden absolute top-0 left-4 z-50">
          <button onClick={toggleMenu} className="text-gray-800 active:scale-90 duration-300 dark:text-white transition-colors">
            {isOpen ? <IoIosClose size={40} /> : <IoIosMenu size={40} />}
          </button>
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-full h-full backdrop-blur-md bg-white/80 shadow-lg rounded-md text-gray-800 z-40 flex flex-col items-center justify-center text-4xl transition-all duration-500 ease-in-out transform 
      dark:dark:bg-neutral-900/80 dark:text-white ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <ul className="flex flex-col gap-12">
          <li className="hover:text-blue-600 transition">
            <Link to="/home" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="hover:text-blue-600 transition">
            <Link to="/clients" onClick={toggleMenu}>Clients</Link>
          </li>
          {isAdmin &&
            <li className="hover:text-blue-600 transition">
              <Link to="/users" onClick={toggleMenu}>Users</Link>
            </li>
          }
          <li className="hover:text-blue-600 transition">
            <Link to="/profile" onClick={toggleMenu}>Profile</Link>
          </li>
          {isAuthenticated &&
            <li className="text-red-500 text-2xl text-center mt-8">
              <button onClick={handleLogout}>Log Out</button>
            </li>
          }
        </ul>
      </div>

    </>
  )
}
