import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import SideBar from "../components/SideBar"

export default function EditUser() {
  const nav = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [updateUserName, setUpdateUserName] = useState("")
  const [updateName, setUpdateName] = useState("")
  const [updateEmail, setUpdateEmail] = useState("")
  const [updateRole, setUpdateRole] = useState("")
  const [date, setDate] = useState("")
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
  })

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const { data } = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUser(data)
      setUpdateUserName(data.userName)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.patch(`http://localhost:${import.meta.env.VITE_PORT}/api/admin/${userId}`, {
        userName: updateUserName,
        name: updateName,
        email: updateEmail,
        role: updateRole,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      notyf.success("User updated successfully!")
      nav("/")
    } catch (error) {
      console.error("Failed to update user", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  // If user data is not loaded yet, show loading message
  if (!user) return <p>Loading...</p>

  return (
    <div className='bg-gray-200 min-h-screen flex flex-col'>
      <SideBar />
      <div className='flex flex-grow items-center justify-center'>
        <div className='bg-gray-50 flex flex-row rounded-2xl shadow-lg max-w-4xl p-10 items-center'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
            <span className='flex items-center gap-4 p-1'>
              <h1 className='font-semibold text-xl w-1/4'>User Name:</h1>
              <input value={updateUserName} onChange={(e) => { setUpdateUserName(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' />
            </span>
            <span className='flex items-center gap-4 p-1'>
              <h1 className='font-semibold text-xl w-1/4'>Name:</h1>
              <input value={updateName} onChange={(e) => { setUpdateName(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' />
            </span>
            <span className='flex items-center gap-4 p-1'>
              <h1 className='font-semibold text-xl w-1/4'>Email:</h1>
              <input value={updateEmail} onChange={(e) => { setUpdateEmail(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' />
            </span>
            <span className='flex items-center gap-4 p-1'>
              <h1 className='font-semibold text-xl w-1/4'>Account Created:</h1>
              <input value={new Date(date).toLocaleDateString("en-IL")} className='p-2 rounded-xl bg-white w-3/4' disabled />
            </span>
            <span className='flex items-center gap-4 p-1'>
              <h1 className='font-semibold text-xl w-1/4'>Role:</h1>
              <input value={updateRole} onChange={(e) => { setUpdateRole(e.target.value) }} className='p-2 rounded-xl bg-white w-3/4' />
            </span>
            <button className='bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300' type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}


