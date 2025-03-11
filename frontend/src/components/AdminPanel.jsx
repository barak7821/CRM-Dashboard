import React, { useEffect, useState } from 'react'
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import axios from "axios"
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel({ users }) {
    const nav = useNavigate()
    const notyf = new Notyf({
        position: {
            x: 'center',
            y: 'top'
        }
    })
    const [usersList, setUsersList] = useState([]);
    const [sortBy, setSortBy] = useState(null)
    const [isOpen, setIsOpen] = useState(null)

    useEffect(() => {
        setUsersList(users)
    }, [users])

    // Sort the users based on username
    const handleSort = () => {
        const sortedUsers = [...usersList].sort((a, b) => {
            if (sortBy === 'asc') {
                return a.userName.localeCompare(b.userName)
            } else {
                return b.userName.localeCompare(a.userName)
            }
        })
        setUsersList(sortedUsers);
        setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
    }

    // Toggle the settings menu for each user when clicking on the settings icon
    const handleClick = (id) => {
        setIsOpen(prevState => (prevState === id ? null : id))
    }

    // Delete a user account from the database
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await axios.delete(`http://localhost:${import.meta.env.VITE_PORT}/api/admin`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { userId: id }
            })
            console.log(response.data)
            notyf.success("Account has been deleted successfully.")

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
    return (
        <div className='overflow-x-auto rounded-xl border border-gray-300 w-[80%] bg-white shadow-md'>
            <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className='border-b border-gray-300'>
                    <tr>
                        <th style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }} className='p-3 text-left text-sm text-gray-600 border-r border-gray-200 w-[15%]'>

                            {/* Sort users based on username */}
                            <span className='flex'>
                                <p>User Name</p>
                                <button onClick={handleSort} className='text-gray-500 hover:text-black active:text-black cursor-pointer'>
                                    {sortBy === 'asc' ? <FaSortUp /> : sortBy === 'desc' ? <FaSortDown /> : <FaSort />}
                                </button>
                            </span>
                        </th>
                        <th className='p-3 text-left text-sm text-gray-600 w-[15%]'>Name</th>
                        <th className='p-3 text-left text-sm text-gray-600 w-[15%]'>Email</th>
                        <th className='p-3 text-left text-sm text-gray-600 w-[15%]'>Access Level</th>
                        <th className='p-3 text-left text-sm text-gray-600 w-[10%]'>Date Added</th>
                        <th className='p-3 text-left text-sm text-gray-600 w-[3%]'>
                            <span>
                                <button><IoMdSettings className='scale-130 active:text-black hover:text-black' /></button>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map((user, index) => (
                        <tr key={user._id} className={`border-gray-200 hover:bg-gray-50 ${index === usersList.length - 1 ? "" : "border-b"}`}>
                            <td style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }} className='p-3 text-sm border-r border-gray-100'>{user.userName}</td>
                            <td className='p-3 text-sm'>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</td>
                            <td className='p-3 text-sm'>{user.email}</td>
                            <td className='p-3 text-sm'>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}</td>
                            <td className='p-3 text-sm'>{new Date(user.createdAt).toLocaleDateString("en-IL")}</td>
                            <td className='p-3 text-left text-sm text-gray-400 w-[3%]'>
                                <span>
                                    <button onClick={(e) => { handleClick(user._id) }}><IoMdSettings className={`scale-130 active:text-black hover:text-black ${isOpen === user._id ? "text-black" : ""}`} /></button>
                                </span>

                                {isOpen === user._id && (
                                    <div className='absolute bg-white shadow-lg rounded mt-2 w-32 z-20'>
                                        <button onClick={() => handleEdit(user._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100'>Edit</button>
                                        <button onClick={() => handleDelete(user._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100'>Delete</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

