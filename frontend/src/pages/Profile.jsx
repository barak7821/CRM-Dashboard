import React, { useEffect, useState } from 'react'
import SideBar from "../components/SideBar"
import axios from 'axios'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Loading from '../components/Loading';
import { initTheme } from "../utils/DarkMode"
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [userData, setUserData] = useState(null)
  const [updateName, setUpdateName] = useState("")
  const [updateEmail, setUpdateEmail] = useState("")
  const [updateRole, setUpdateRole] = useState("")
  const [updatePassword, setUpdatePassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // This function fetches all users from the API.
  const getUser = async () => {

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const { data } = await axios.get(`${baseApiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserData(data)
    } catch (error) {
      console.error("Failed to fetch user data", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  // If user data is not loaded yet, show loading message
  if (!userData) return <Loading />

  // Update state with fetched data
  const { name, email, createdAt, role } = userData
  const formattedDate = new Date(createdAt).toLocaleDateString("en-IL")

  // This handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

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

    try {
      await axios.patch(`${baseApiUrl}/user`, {
        name: updateName,
        email: updateEmail,
        password: updatePassword,
        role: updateRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      notyf.success("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update user data", error)
      if (error.response.status === 404) return notyf.error("User not found. Please try again.")
      if (error.response?.status === 400 && error.response.data?.code === "pass_wrong") return notyf.error("New password cannot be the same as the current password.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  // This function deletes the user account.
  const deleteUser = async () => {

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.delete(`${baseApiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      notyf.success("Your account has been deleted successfully.")

      // Remove token from local storage
      localStorage.removeItem("token")
      nav("/login")
    } catch (error) {
      console.error("Failed to delete user data", error)
      if (error.response.status === 404) return notyf.error("User not found. Please try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col select-none dark:bg-neutral-900">
      <SideBar />
      <div className="flex flex-grow items-center justify-center py-10">
        <div className="lg:bg-white bg-gray-200 w-full max-w-xl lg:shadow-xl rounded-xl p-8 dark:lg:bg-zinc-800 dark:bg-neutral-900">

          {/* form section */}
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6 dark:text-white">Edit Your Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Name</label>
              <input onChange={(e) => setUpdateName(e.target.value)} className="px-4 py-2 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" placeholder={name} />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Email</label>
              <input onChange={(e) => setUpdateEmail(e.target.value)} type="email" className="px-4 py-2 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" placeholder={email} />
            </div>
            <div className="relative flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Password</label>
              <input onChange={(e) => setUpdatePassword(e.target.value)} type={isPasswordVisible ? "text" : "password"} className="px-4 py-2 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300 pr-10" placeholder="Enter new password" />
              <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {isPasswordVisible ? <LuEyeClosed /> : <LuEye />}
              </button>
            </div>
            <div className="relative flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Confirm Password</label>
              <input onChange={(e) => setConfirmPassword(e.target.value)} type={isConfirmPasswordVisible ? "text" : "password"} className="px-4 py-2 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300 pr-10" placeholder="Confirm password" />
              <button type="button" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {isConfirmPasswordVisible ? <LuEyeClosed /> : <LuEye />}
              </button>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Account Created</label>
              <input className="px-4 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-500 focus:outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" placeholder={formattedDate} disabled />
            </div>
            {role.toLowerCase() === "admin" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Role</label>
                <input onChange={(e) => setUpdateRole(e.target.value)} className="px-4 py-2 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" placeholder={role} />
              </div>
            )}
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-900 dark:hover:bg-blue-800">Update Profile</button>
            <button type="button" onClick={deleteUser} className="text-red-500 border border-gray-300 bg-white hover:bg-gray-100 py-2 rounded-md transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-400">Delete Account</button>
          </form>
        </div>
      </div>
    </div>
  )
}
