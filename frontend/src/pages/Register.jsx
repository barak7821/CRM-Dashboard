import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import image from "../assets/test.png"
import { Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from "axios"
import { useAuth } from '../utils/AuthContext'
import { useGoogleLogin } from "@react-oauth/google";
import { initTheme } from "../utils/DarkMode"

export default function Register() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { setIsAuthenticated } = useAuth()

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // Google Login and Registration
  const login = useGoogleLogin({
    onSuccess: async (TokenResponse) => {
      try {
        const response = await axios.post(`${baseApiUrl}/auth/google`, {
          token: TokenResponse.access_token
        })
        // Save the token in local storage
        localStorage.setItem("token", response.data.token)
        setIsAuthenticated(true)
        notyf.success("Logged in successfully with Google!")
        nav("/home")
      } catch (error) {
        console.error("Google login error:", error)
        notyf.error("Google login failed. Please try again.")
      }
    },
    onError: () => {
      notyf.error("Google login was cancelled or failed.")
    }
  })

  // This handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if all fields are filled
    if (name.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0)
      return notyf.error("Please fill out all fields. All fields are required.")

    // Checking if name length is less than 2 characters
    if (name.length < 2) return notyf.error("Your name must be at least 2 characters long.")

    // Check if email is valid
    if (!email.includes("@")) return notyf.error("Please enter a valid email address.")

    // Checking if password is valid
    if (password.length < 8 || password.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")

    // Check if passwords match
    if (confirmPassword !== password) return notyf.error("The passwords do not match. Please try again.")

    try {
      const response = await axios.post(`${baseApiUrl}/auth/register`, {
        name,
        email,
        password
      })

      // Save the token in local storage
      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
      notyf.success("Registration successful.")
      nav("/home")
    } catch (error) {
      console.error("Registration error:", error)
      if (error.response && error.response.status === 409) return notyf.error("An account with this email already exists.")
      if (error.response && error.response.status === 400) return notyf.error("Invalid input. Please check your details and try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  return (
    <div className='bg-gray-200 min-h-screen flex flex-col select-none dark:bg-neutral-900'>
      <div className='flex flex-grow lg:items-center justify-center'>
        <div className='lg:bg-gray-50 bg-gray-200 flex flex-row rounded-2xl lg:shadow-2xl max-w-4xl p-5 lg:items-center dark:lg:bg-zinc-800 dark:bg-neutral-900'>

          {/* form section */}
          <div className='md:w-1/2 px-16'>
            <h2 className='text-2xl font-bold text-blue-900 dark:text-white'>Registration</h2>
            <p className='text-sm mt-4 text-blue-900 dark:text-zinc-300'>Please register by completing the information below.</p>

            {/* inputs */}
            <form className='flex flex-col' onSubmit={handleSubmit}>
              <input onChange={(e) => { setName(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300' type="text" placeholder='Name' />
              <input onChange={(e) => { setEmail(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300' type="email" placeholder='Email' />
              {/* password */}
              <span className='relative'>
                <input onChange={(e) => { setPassword(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white w-full border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300' type={isPasswordVisible ? "text" : "password"} placeholder='Password' />
                <button onClick={() => { !isPasswordVisible ? setIsPasswordVisible(true) : setIsPasswordVisible(false) }} className='absolute top-1/2 right-3' type="button">
                  {isPasswordVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300 dark:text-zinc-400' /> :
                    <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300 dark:text-zinc-400' />}
                </button>
              </span>
              {/* confirm password */}
              <span className='relative'>
                <input onChange={(e) => { setConfirmPassword(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white w-full border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300' type={isConfirmPassVisible ? "text" : "password"} placeholder='Confirm Password' />
                <button onClick={() => { !isConfirmPassVisible ? setIsConfirmPassVisible(true) : setIsConfirmPassVisible(false) }} className='absolute top-1/2 right-3' type="button">
                  {isConfirmPassVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300 dark:text-zinc-400' /> :
                    <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300 dark:text-zinc-400' />}
                </button>
              </span>
              <button type="submit" className='bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300'>Register</button>
            </form>

            {/* Seperator */}
            <div className='my-5 grid grid-cols-3 items-center text-gray-500 dark:text-zinc-500'>
              <hr className='border-gray-500 dark:border-zinc-700' />
              <p className='text-center text-sm'>OR</p>
              <hr className='border-gray-500 dark:border-zinc-700' />
            </div>

            {/* Login with Google */}
            <button onClick={() => login()} className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-white text-gray-800 font-semibold hover:scale-105 active:scale-95 duration-300 cursor-pointer border border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-600">
              <img src="google-icon.svg" className="w-5 h-5" alt="google" />
              Continue with Google
            </button>

            {/* Login */}
            <div className='mt-5 text-sm flex justify-between items-center'>
              <p className='dark:text-white'>You have an account...</p>
              <Link to={"/"} className='py-2 px-5 bg-blue-900 text-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 duration-300'>Login</Link>
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
