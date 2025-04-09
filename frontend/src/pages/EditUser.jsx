import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import SideBar from "../components/SideBar"
import Loading from '../components/Loading';
import { initTheme } from "../utils/DarkMode"

export default function EditUser() {
  const nav = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [updateName, setUpdateName] = useState("")
  const [updateEmail, setUpdateEmail] = useState("")
  const [updateRole, setUpdateRole] = useState("")
  const [date, setDate] = useState("")
  const notyf = new Notyf({ position: { x: 'center', y: 'top', }, })

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // Fetch user data from the API
  const fetchUserData = async () => {

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const { data } = await axios.get(`${baseApiUrl}/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update state with fetched data
      setUser(data)
      setUpdateName(data.name)
      setUpdateEmail(data.email)
      setUpdateRole(data.role)
      setDate(data.createdAt)
    } catch (error) {
      console.error("Failed to fetch user data", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [userId])

  // This handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await axios.patch(`${baseApiUrl}/admin/${userId}`, {
        name: updateName,
        email: updateEmail,
        role: updateRole,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      notyf.success("User updated successfully!")

      // Redirect to the users list page
      nav("/users")
    } catch (error) {
      console.error("Failed to update user", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  // If user data is not loaded yet, show loading message
  if (!user) return <Loading />

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col select-none dark:bg-neutral-900">
      <SideBar />
      <div className="flex flex-grow items-center justify-center py-10">
        <div className="bg-white w-full max-w-xl shadow-xl rounded-xl p-8 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6 dark:text-white">Edit User</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Name</label>
              <input value={updateName} onChange={(e) => setUpdateName(e.target.value)} className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Email</label>
              <input value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Account Created</label>
              <input value={new Date(date).toLocaleDateString("en-IL")} disabled className="px-4 py-2 bg-white rounded-md border border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Role</label>
              <input value={updateRole} onChange={(e) => setUpdateRole(e.target.value)} className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-900 dark:hover:bg-blue-800">Update User</button>
            <button type="button" onClick={() => { nav("/users") }} className="border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-400 dark:text-white">Cancel</button>
          </form>
        </div>
      </div>
    </div>

  )
}


