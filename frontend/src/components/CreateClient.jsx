import React, { useState } from 'react'
import axios from "axios"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function CreateClient({ isOpen, updateList }) {
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [type, setType] = useState("")
    const [note, setNote] = useState("")

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    // This handles the form submission.
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Checking if token exists in local storage
        const token = localStorage.getItem("token")
        if (!token) return

        // Checking if name length is less than 2 characters
        if (name.length < 2) return notyf.error("Your name must be at least 2 characters long.")

        // Check if email is valid
        if (!email.includes("@")) return notyf.error("Please enter a valid email address.")

        // Setting up the data to be sent to the API
        const data = { name, email }

        // If they are not empty, add them to the data object
        if (phone) data.phone = phone
        if (type) data.type = type
        if (note) data.note = note

        try {
            const response = await axios.post(`${baseApiUrl}/client`, data, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(response.data)
            notyf.success("Created Clients successful.")
            updateList()

            // Close the modal
            isOpen(false)
        } catch (error) {
            console.error("Create Client error:", error)
            notyf.error("Something went wrong. Please try again later.")
        }
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-200 dark:bg-neutral-900">
            <div className="w-[400px] bg-white shadow-xl rounded-xl p-8 dark:bg-zinc-800">

                {/* form section */}
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-1 dark:text-white">Create New Client</h2>
                <p className="text-sm text-center text-gray-500 mb-6 dark:text-zinc-300">Please complete the information below.</p>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="number" placeholder="Phone" className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                    <select onChange={(e) => setType(e.target.value)} value={type} className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300 text-gray-700">
                        <option value="" hidden>Please Select Type</option>
                        <option value="client">Client</option>
                        <option value="potential">Potential</option>
                        <option value="supplier">Supplier</option>
                        <option value="other">Other</option>
                    </select>
                    <input onChange={(e) => setNote(e.target.value)} value={note} type="text" placeholder="Note" className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
                    <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-900 dark:hover:bg-blue-800">Create</button>
                </form>
                <button onClick={() => isOpen(false)} className="w-full mt-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-400 dark:text-white">Cancel</button>
            </div>
        </div>
    )
}