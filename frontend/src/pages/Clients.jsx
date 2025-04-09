import React, { useEffect, useState } from 'react'
import SideBar from "../components/SideBar"
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoMdSettings, IoIosSearch, IoMdAdd } from "react-icons/io";
import axios from "axios"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import CreateClient from '../components/CreateClient';
import { MdClear } from "react-icons/md";
import Loading from '../components/Loading';
import { useAuth } from '../utils/AuthContext';
import { initTheme } from "../utils/DarkMode"

export default function Clients() {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const [sort, setSort] = useState({ field: null, direction: null })
    const [isCreateClientOpen, setIsCreateClientOpen] = useState(null)
    const [clientsList, setClientsList] = useState([])
    const [isOpen, setIsOpen] = useState(null)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { isAdmin } = useAuth()

    // Set theme mode
    initTheme()

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    // This function fetches the clients list from the API.
    const getClients = async () => {

        // Set loading state to true while fetching data
        setIsLoading(true)

        // Checking if token exists in local storage
        const token = localStorage.getItem("token")
        if (!token) return

        // Check if the user is an admin or not
        const endpoint = isAdmin ? `${baseApiUrl}/admin/clients` : `${baseApiUrl}/client`

        try {
            const { data } = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setClientsList(data)
        } catch (error) {
            console.error("Failed to fetch clients list", error)
            if (error.response.status === 401 || error.response.status === 403) return nav("/")
        } finally {
            // Set loading state to false after fetching data
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin !== null) {
            getClients()
            setIsOpen(null)
        }
    }, [search, isAdmin])


    // Sort the users based on email
    const handleSort = () => {
        const direction = sort.field === "email" && sort.direction === "asc" ? "desc" : "asc"
        const sorted = [...clientsList].sort((a, b) => {
            return direction === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
        })
        setClientsList(sorted)
        setSort({ field: "email", direction })
    }

    // Sort the users based on date
    const handleSortByDate = () => {
        const direction = sort.field === "createdAt" && sort.direction === "asc" ? "desc" : "asc"
        const sorted = [...clientsList].sort((a, b) => {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return direction === "asc" ? dateA - dateB : dateB - dateA
        })
        setClientsList(sorted)
        setSort({ field: "createdAt", direction })
    }

    // Sort the users based on type
    const handleSortBytype = () => {
        const direction = sort.field === "type" && sort.direction === "asc" ? "desc" : "asc"
        const sorted = [...clientsList].sort((a, b) => {
            const typeA = a.type || ""
            const typeB = b.type || ""
            return direction === "asc"
                ? typeA.localeCompare(typeB)
                : typeB.localeCompare(typeA)
        })
        setClientsList(sorted)
        setSort({ field: "type", direction })
    }

    // Open and close the settings menu for each client
    const handleClick = (id) => {
        setIsOpen(prevState => (prevState === id ? null : id))
    }

    // Send the user to the edit page of the client
    const handleEdit = (id) => {
        nav(`/client/${id}`)
    }

    // Delete the client from the list
    const handleDelete = async (id) => {
        // Checking if token exists in local storage
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const response = await axios.delete(`${baseApiUrl}/client`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { id }
            })
            console.log(response.data)
            notyf.success("Account has been deleted successfully.")
            getClients()
            setIsCreateClientOpen(false)

            // Remove the deleted client from the clients list
            setClientsList(prevClients => prevClients.filter(client => client._id !== id))
        } catch (error) {
            console.error("Failed to delete client", error)
            if (error.response.status === 404) return notyf.error("Client not found. Please try again.")
            notyf.error("Something went wrong. Please try again later.")
        }
    }

    // set the status style based on the status of the client
    const statusStyle = (status) => {
        if (status === "pending") return "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
        if (status === "closed") return "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
        if (status === "cancelled") return "bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-200"
        return "bg-gray-100 text-gray-600"
    }

    return (
        <div className='bg-gray-200 min-h-screen select-none dark:bg-neutral-900'>
            <SideBar />
            <div className="flex flex-col justify-center items-center lg:ml-[130px]">
                {!isCreateClientOpen &&
                    <div className='flex flex-col gap-4 w-full mt-5'>
                        <div className="w-[80%] mx-auto mt-5">
                            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">All Clients</h2>
                            <div className="flex justify-between items-center">
                                <div className="relative w-[30%]">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none dark:text-zinc-300">
                                        <IoIosSearch />
                                    </span>
                                    <input type="text" placeholder="Search by name, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                                    {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg dark:text-white dark:hover:text-zinc-400">
                                        <MdClear />
                                    </button>}
                                </div>
                                <button onClick={() => { setIsCreateClientOpen(true); setIsOpen(false) }} className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-1 border border-blue-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700">
                                    <IoMdAdd className="text-base" />
                                    New
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            {isLoading ?
                                <Loading />
                                : clientsList.length > 0 ?
                                    <div className='overflow-x-auto w-[80%] rounded-xl border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-600'>
                                        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
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
                                                    <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:text-white'>Name</th>
                                                    <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:text-white'>Phone</th>
                                                    {/* Sort users based on type */}
                                                    <th className='p-3 text-left text-sm text-gray-600 border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                                                        <span className='flex'>
                                                            <p>Type</p>
                                                            <button onClick={handleSortBytype} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                                                                {sort.field === "type" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}
                                                            </button>
                                                        </span>
                                                    </th>
                                                    <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:text-white'>Status</th>
                                                    <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:text-white'>Deal Value</th>
                                                    <th className='p-3 text-left text-sm text-gray-600 w-[15%] dark:text-white'>Note</th>
                                                    {/* Sort users based on date */}
                                                    <th className='p-3 text-left text-sm text-gray-600 border-gray-200 w-[15%] dark:border-zinc-600 dark:text-white'>
                                                        <span className='flex'>
                                                            <p>Date Added</p>
                                                            <button onClick={handleSortByDate} className='text-gray-500 hover:text-black active:text-black cursor-pointer dark:text-white dark:hover:text-zinc-300 dark:active:text-zinc-300'>
                                                                {sort.field === "createdAt" ? sort.direction === "asc" ? <FaSortUp /> : <FaSortDown /> : <FaSort />}

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
                                                {clientsList.filter(client =>
                                                    client.email?.toLowerCase().includes(search.toLowerCase()) ||
                                                    client.name?.toLowerCase().includes(search.toLowerCase()) ||
                                                    client.phone?.includes(search)
                                                ).map((client) =>
                                                    <tr key={client._id} className={`border-gray-200 hover:bg-gray-50 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:text-white`}>
                                                        <td className='p-3 text-sm border-r border-gray-100 dark:border-zinc-600'>{client.email}</td>
                                                        <td className='p-3 text-sm'>{client.name ? client.name.charAt(0).toUpperCase() + client.name.slice(1) : ""}</td>
                                                        <td className='p-3 text-sm'>{client.phone}</td>
                                                        <td className='p-3 text-sm'>{client.type ? client.type.charAt(0).toUpperCase() + client.type.slice(1) : ""}</td>
                                                        <td className='p-3 text-sm'>{client.status ?
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyle(client.status)}`}>
                                                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                                            </span> : ""
                                                        }
                                                        </td>
                                                        <td className='p-3 text-sm'>{client.dealValue ? client.dealValue + "$" : ""}</td>
                                                        <td className='p-3 text-sm'>{client.note}</td>
                                                        <td className='p-3 text-sm'>{new Date(client.createdAt).toLocaleDateString("en-IL")}</td>
                                                        <td className='p-3 text-left text-sm text-gray-400 w-[3%]'>
                                                            <span>
                                                                <button onClick={() => { handleClick(client._id) }}><IoMdSettings className={`scale-130 active:text-black hover:text-black dark:active:text-zinc-400 dark:hover:text-zinc-400 dark:text-white ${isOpen === client.id ? "text-black" : ""}`} /></button>
                                                            </span>
                                                            {isOpen === client._id && (
                                                                <div className='absolute bg-white shadow-lg rounded mt-2 w-32 z-20 dark:bg-zinc-800'>
                                                                    <button onClick={() => handleEdit(client._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700'>Edit</button>
                                                                    <button onClick={() => handleDelete(client._id)} className='w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700'>Delete</button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <div className="text-center text-gray-500 mt-10 dark:text-neutral-300">
                                        <p className="text-lg font-medium">You haven't added any clients yet.</p>
                                        <p className="text-sm mt-1">Click on "New" to create your first client.</p>
                                    </div>}
                        </div>
                    </div>
                }
                {isCreateClientOpen && <CreateClient isOpen={setIsCreateClientOpen} updateList={getClients} />}
            </div>
        </div >
    )
}

