import React, { useEffect, useState } from 'react'
import SideBar from "../components/SideBar"
import axios from 'axios'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoMdSettings, IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MdClear } from "react-icons/md";
import Loading from '../components/Loading';
import { initTheme } from "../utils/DarkMode"

export default function Users() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [usersList, setUsersList] = useState([])
  const [sort, setSort] = useState({ field: null, direction: null })
  const [isOpen, setIsOpen] = useState(true)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // Fetch all users from the database
  const getUser = async () => {

    // Set loading state to true while fetching data
    setIsLoading(true)

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const { data } = await axios.get(`${baseApiUrl}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsersList(data)
    } catch (error) {
      console.error("Failed to fetch user data", error)
      notyf.error("Something went wrong. Please try again later.")
    } finally {
      // Set loading state to false after fetching data
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    setIsOpen(null)
  }, [search])

  // Sort the users based on email
  const handleSort = () => {
    const direction = sort.field === "email" && sort.direction === "asc" ? "desc" : "asc"
    const sorted = [...usersList].sort((a, b) => {
      return direction === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
    })
    setUsersList(sorted)
    setSort({ field: "email", direction })
  }

  // Sort the users based on login date
  const handleSortByLogin = () => {
    const direction = sort.field === "lastLogin" && sort.direction === "asc" ? "desc" : "asc"
    const sorted = [...usersList].sort((a, b) => {
      const dateA = new Date(a.lastLogin)
      const dateB = new Date(b.lastLogin)
      return direction === "asc" ? dateA - dateB : dateB - dateA
    })
    setUsersList(sorted)
    setSort({ field: "lastLogin", direction })
  }

  // Sort the users based on date
  const handleSortByDate = () => {
    const direction = sort.field === "createdAt" && sort.direction === "asc" ? "desc" : "asc"
    const sorted = [...usersList].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return direction === "asc" ? dateA - dateB : dateB - dateA
    })
    setUsersList(sorted)
    setSort({ field: "createdAt", direction })
  }

  // Sort the users based on type
  const handleSortByAccess = () => {
    const direction = sort.field === "role" && sort.direction === "asc" ? "desc" : "asc"
    const sorted = [...usersList].sort((a, b) => {
      return direction === "asc"
        ? (a.role || "user").localeCompare(b.role || "user")
        : (b.role || "user").localeCompare(a.role || "user")
    })
    setUsersList(sorted)
    setSort({ field: "role", direction })
  }

  // Toggle the settings menu for each user when clicking on the settings icon
  const handleClick = (id) => {
    setIsOpen(prevState => (prevState === id ? null : id))
  }

  // Delete a user account from the database
  const handleDelete = async (id) => {

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.delete(`${baseApiUrl}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: id }
      })
      notyf.success("Account has been deleted successfully.")

      // Remove the deleted user from the users list
      setUsersList((prevUsers) => prevUsers.filter((user) => user._id !== id))
    } catch (error) {
      console.error("Failed to delete user", error)
      if (error.response.status === 404) return notyf.error("User not found. Please try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  // Navigate to the user edit page for the selected user
  const handleEdit = (id) => {
    nav(`/edit-user/${id}`)
  }

  // Make the first letter of the string uppercase
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <div className='bg-gray-200 min-h-screen flex flex-col select-none dark:bg-neutral-900'>
      <SideBar />
      <div className="flex flex-col justify-center items-center lg:ml-[130px]">
        <div className="flex flex-col gap-4 w-full mt-5">
          <div className="w-[80%] mx-auto mt-5">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">All Users</h2>
            <div className="flex justify-between items-center">
              <div className="relative w-[30%]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none dark:text-zinc-300">
                  <IoIosSearch />
                </span>
                <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg dark:text-white dark:hover:text-zinc-400">
                  <MdClear />
                </button>}
              </div>
            </div>
          </div>
          {isLoading ?
            <Loading />
            : <div className="flex flex-col gap-4 items-center">
              <div className='overflow-x-auto rounded-xl border border-gray-300 w-[80%] bg-white shadow-md dark:bg-zinc-800 dark:border-zinc-600'>
                <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
                  <thead className='border-b border-gray-300 dark:border-zinc-600'>
                    <tr>
                      {/* Sort users based on email */}
                      <th className='p-3 text-left text-sm text-gray-600 border-r border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                        <span className='flex'>
                          <p>Email</p>
                          <button onClick={handleSort} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                            {sort.field === "email" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}
                          </button>
                        </span>
                      </th>
                      <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:border-zinc-600 dark:text-white'>Name</th>
                      {/* Sort users based on type */}
                      <th className='p-3 text-left text-sm text-gray-600 border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                        <span className='flex'>
                          <p>Access Level</p>
                          <button onClick={handleSortByAccess} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                            {sort.field === "role" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}
                          </button>
                        </span>
                      </th>
                      {/* Sort users based on created date */}
                      <th className='p-3 text-left text-sm text-gray-600 border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                        <span className='flex'>
                          <p>Date Added</p>
                          <button onClick={handleSortByDate} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                            {sort.field === "createdAt" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}
                          </button>
                        </span>
                      </th>
                      {/* Sort users based on last login date */}
                      <th className='p-3 text-left text-sm text-gray-600 border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                        <span className='flex'>
                          <p>Last Login</p>
                          <button onClick={handleSortByLogin} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                            {sort.field === "lastLogin" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}
                          </button>
                        </span>
                      </th>
                      <th className='p-3 text-left text-sm text-gray-600 w-[3%] dark:text-white'>
                        <span>
                          <button><IoMdSettings className='scale-130 active:text-black hover:text-black dark:active:text-zinc-400 dark:hover:text-zinc-400' /></button>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.filter(user =>
                      user.email.toLowerCase().includes(search.toLowerCase()) ||
                      user.name.toLowerCase().includes(search.toLowerCase())
                    ).map((user, index) => (
                      <tr key={user._id} className={`border-gray-200 hover:bg-gray-50 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:text-white ${index === usersList.length - 1 ? "" : "border-b"}`}>
                        <td style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }} className='p-3 text-sm border-r border-gray-100 dark:border-zinc-600'>{user.email}</td>
                        <td className='p-3 text-sm'>{capitalize(user.name)}</td>
                        <td className='p-3 text-sm'>{capitalize(user.role)}</td>
                        <td className='p-3 text-sm'>{new Date(user.createdAt).toLocaleDateString("en-IL")}</td>
                        <td className='p-3 text-sm'>{new Date(user.lastLogin).toLocaleDateString("en-IL")}
                          <br />
                          <span className="text-xs ml-5">
                            {new Date(user.lastLogin).toLocaleString("en-IL", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false
                            })}
                          </span>
                        </td>
                        <td className='p-3 text-left text-sm text-gray-400 w-[3%]'>
                          <div>
                            <button onClick={(e) => { handleClick(user._id) }}><IoMdSettings className={`scale-130 active:text-black hover:text-black dark:active:text-zinc-400 dark:hover:text-zinc-400 dark:text-white ${isOpen === user._id ? "text-black" : ""}`} /></button>
                          </div>

                          {isOpen === user._id && (
                            <div className='absolute bg-white shadow-lg rounded mt-2 w-32 z-20 dark:bg-zinc-800'>
                              <button onClick={() => handleEdit(user._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700'>Edit</button>
                              <button onClick={() => handleDelete(user._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700'>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}