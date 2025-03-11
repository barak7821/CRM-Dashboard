import React, { useEffect, useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import image from "../assets/test.png"
import { Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from "axios"
import SideBar from "../components/SideBar"

export default function Register() {
  const nav = useNavigate()
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top'
    }
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false)
  const [userName, setUserName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Checking if a valid user session exists, otherwise logging out
  const checkUserExists = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/checkuser`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.exists) {
        nav("/")
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      localStorage.removeItem("token")
    }
  }

  useEffect(() => {
    checkUserExists()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (userName.length === 0 || name.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0)
      return notyf.error("Please fill out all fields. All fields are required.")
    
    // Checking if username length is less than 6 characters
    if (userName.length < 6) return notyf.error("Your username must be at least 6 characters long.")
    
      // Checking if name length is less than 2 characters
    if (name.length < 2) return notyf.error("Your name must be at least 2 characters long.")
    
      // Check if email is valid
    if (!email.includes("@")) return notyf.error("Please enter a valid email address.")
    
      // Checking if password is valid
    if (password.length < 8 || password.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")
    
      // Check if passwords match
    if (confirmPassword !== password) return notyf.error("The passwords do not match. Please try again.")

    try {
      const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/register`, {
        userName,
        name,
        email,
        password
      })
      console.log(response.data)
      notyf.success("Registration successful! You can now log in.")
      nav("/")
    } catch (error) {
      console.error("Registration error:", error)
      if (error.response && error.response.status === 409) return notyf.error("An account with this email already exists.")
      if (error.response && error.response.status === 400) return notyf.error("Invalid input. Please check your details and try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  return (
    <div className='bg-gray-200 min-h-screen flex flex-col'>
      <SideBar />
      <div className='flex flex-grow items-center justify-center'>
        <div className='lg:bg-gray-50 bg-gray-200 flex flex-row rounded-2xl lg:shadow-2xl max-w-4xl p-5 items-center'>

          {/* inputs & buttons */}
          <div className='md:w-1/2 px-16'>
            <h2 className='text-2xl font-bold text-blue-900'>Registration</h2>
            <p className='text-sm mt-4 text-blue-900'>Please register by completing the information below.</p>

            {/* inputs */}
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <input onChange={(e) => { setUserName(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border border-blue-500' type="text" placeholder='Username' />
              <input onChange={(e) => { setName(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border border-blue-500' type="text" placeholder='Name' />
              <input onChange={(e) => { setEmail(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border border-blue-500' type="email" placeholder='Email' />
              {/* password */}
              <span className='relative'>
                <input onChange={(e) => { setPassword(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white w-full border border-blue-500' type={isPasswordVisible ? "text" : "password"} placeholder='Password' />
                <button onClick={() => { !isPasswordVisible ? setIsPasswordVisible(true) : setIsPasswordVisible(false) }} className='absolute top-1/2 right-3' type="button">
                  {isPasswordVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' /> :
                    <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' />}
                </button>
              </span>
              {/* confirm password */}
              <span className='relative'>
                <input onChange={(e) => { setConfirmPassword(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white w-full border border-blue-500' type={isConfirmPassVisible ? "text" : "password"} placeholder='Confirm Password' />
                <button onClick={() => { !isConfirmPassVisible ? setIsConfirmPassVisible(true) : setIsConfirmPassVisible(false) }} className='absolute top-1/2 right-3' type="button">
                  {isConfirmPassVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' /> :
                    <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' />}
                </button>
              </span>
              <button type="submit" className='bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300'>Register</button>
            </form>

            {/* Seperator */}
            <div className='mt-10 grid grid-cols-3 items-center text-gray-500'>
              <hr className='border-gray-500' />
              <p className='text-center text-sm'>OR</p>
              <hr className='border-gray-500' />
            </div>

            <div className='mt-3 text-sm flex justify-between items-center'>
              <p>You have an account...</p>
              <Link to={"/login"} className='py-2 px-5 bg-blue-900 text-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 duration-300'>Login</Link>
            </div>
          </div>

          {/* img */}
          <div className='w-1/2 md:block hidden'>
            <img className='rounded-2xl max-w-full' src={image} />
          </div>
        </div>
      </div>
    </div>
  )
}
