import React, { useEffect, useState } from 'react'
import SideBar from "../components/SideBar"
import axios from 'axios'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function MainPage() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [userData, setUserData] = useState(null)
  const [updateUserName, setUpdateUserName] = useState("")
  const [updateName, setUpdateName] = useState("")
  const [updateEmail, setUpdateEmail] = useState("")
  const [updateRole, setUpdateRole] = useState("")
  const [updatePassword, setUpdatePassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [allUsers, setAllUsers] = useState([])
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token")

      const { data } = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserData(data)

      // Checking if user is admin
      if (data.role && data.role.toLowerCase() === "admin") {
        const usersResponse = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllUsers(usersResponse.data)
      } else {
        setAllUsers([])
      }
    } catch (error) {
      console.error("Failed to fetch user data", error)
      if (error.response.status === 401 || error.response.status === 403) return nav("/")
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  // If user data is not loaded yet, show loading message
  if (!userData) return <p className="flex justify-center items-center">Loading...</p>

  const { userName, name, email, createdAt, role } = userData
  const formattedDate = new Date(createdAt).toLocaleDateString("en-IL")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      // Checking if name length is less than 2 characters
      if (updateName.length > 0) {
        if (updateName.length < 2) return notyf.error("Your name must be at least 2 characters long.")
      }

      // Checking if password is valid
      if (updatePassword.length > 0) {
        if (updatePassword.length < 8 || updatePassword.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")
      }

      // Check if passwords match
      if (confirmPassword !== updatePassword) return notyf.error("The passwords do not match. Please try again.")


      // Check if email is valid
      if (updateEmail.length > 0) {
        if (!updateEmail.includes("@")) return notyf.error("Please enter a valid email address.")
      }

      const response = await axios.patch(`http://localhost:${import.meta.env.VITE_PORT}/api/user`, {
        userName: updateUserName,
        name: updateName,
        email: updateEmail,
        password: updatePassword,
        role: updateRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data)
      notyf.success("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update user data", error)
      if (error.response.status === 404) return notyf.error("User not found. Please try again.")
      if (error.response.status === 400) return notyf.error("New password cannot be the same as the current password.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.delete(`http://localhost:${import.meta.env.VITE_PORT}/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data)
      notyf.success("Your account has been deleted successfully.")
      localStorage.removeItem("token")
      nav("/")
    } catch (error) {
      console.error("Failed to delete user data", error)
      if (error.response.status === 404) return notyf.error("User not found. Please try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  return (
    <>
      {/* If user isn't admin */}
      {!role && (
        <div className='bg-gray-200 min-h-screen flex flex-col'>
          <SideBar />
          <div className='flex flex-grow items-center justify-center'>
            <div className='bg-gray-50 flex flex-row rounded-2xl shadow-2xl max-w-4xl p-10 items-center'>
              <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                <span className='flex items-center gap-4 p-1'>
                  <h1 className='font-semibold text-xl w-1/4'>User Name:</h1>
                  <input onChange={(e) => { setUpdateUserName(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' placeholder={userName} />
                </span>
                <span className='flex items-center gap-4 p-1'>
                  <h1 className='font-semibold text-xl w-1/4'>Name:</h1>
                  <input onChange={(e) => { setUpdateName(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' placeholder={name} />
                </span>
                <span className='flex items-center gap-4 p-1'>
                  <h1 className='font-semibold text-xl w-1/4'>Email:</h1>
                  <input onChange={(e) => { setUpdateEmail(e.target.value) }} type='email' className='p-2 rounded-xl bg-white w-3/4' placeholder={email} />
                </span>

                {/* password */}
                <span className='flex items-center gap-4 p-1 relative'>
                  <h1 className='font-semibold text-xl w-1/4'>Password:</h1>
                  <input onChange={(e) => { setUpdatePassword(e.target.value) }} type={isPasswordVisible ? "text" : "password"} className='p-2 rounded-xl bg-white w-3/4' placeholder={"Enter new password"} />
                  <button onClick={() => { !isPasswordVisible ? setIsPasswordVisible(true) : setIsPasswordVisible(false) }} className='absolute right-3' type="button">
                    {isPasswordVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' /> :
                      <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' />}
                  </button>
                </span>

                {/* confirm password */}
                <span className='flex items-center gap-4 p-1 relative'>
                  <h1 className='font-semibold text-xl w-1/4'>Confirm Password:</h1>
                  <input onChange={(e) => { setConfirmPassword(e.target.value) }} type={isConfirmPasswordVisible ? "text" : "password"} className='p-2 rounded-xl bg-white w-3/4' placeholder={"Confirm password"} />
                  <button onClick={() => { !isConfirmPasswordVisible ? setIsConfirmPasswordVisible(true) : setIsConfirmPasswordVisible(false) }} className='absolute right-3' type="button">
                    {isConfirmPasswordVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' /> :
                      <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' />}
                  </button>
                </span>

                <span className='flex items-center gap-4 p-1'>
                  <h1 className='font-semibold text-xl w-1/4'>Account Created:</h1>
                  <input className='p-2 rounded-xl bg-white w-3/4' placeholder={formattedDate} disabled />
                </span>

                {role && role.toLowerCase() === "admin" &&
                  <span className='flex items-center gap-4 p-1'>
                    <h1 className='font-semibold text-xl w-1/4'>Role:</h1>
                    <input onChange={(e) => { setUpdateRole(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' placeholder={role} />
                  </span>
                }

                <button className='bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300' type="submit">Update</button>
                <button onClick={deleteUser} className='bg-red-600 rounded-xl text-white py-2 w-full cursor-pointer hover:scale-105 active:scale-95 duration-300' type="button">Delete User</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* If user is admin */}
      {role && role.toLowerCase() === "admin" && allUsers.length > 0 && (
        <div className='bg-gray-200 min-h-screen flex flex-col'>
          <SideBar />
          <div className="flex flex-col gap-4 w-full mt-5">
            <h2 className="text-2xl font-semibold mb-4 text-center">All Users</h2>
            <div className="flex flex-col gap-4 items-center">
              {allUsers.length > 0 && (
                <AdminPanel users={allUsers} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
