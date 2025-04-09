import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import SideBar from "../components/SideBar"
import Loading from '../components/Loading';
import { initTheme } from "../utils/DarkMode"

export default function EditClient() {
  const nav = useNavigate()
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [updateName, setUpdateName] = useState("")
  const [updateEmail, setUpdateEmail] = useState("")
  const [updatePhone, setUpdatePhone] = useState("")
  const [updateNote, setUpdateNote] = useState("")
  const [updateType, setUpdateType] = useState("")
  const [updateStatus, setUpdateStatus] = useState("")
  const [updateDeal, setUpdateDeal] = useState("")
  const notyf = new Notyf({ position: { x: 'center', y: 'top', }, })

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // Fetch client data from the API
  const fetchClientData = async () => {

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const { data } = await axios.get(`${baseApiUrl}/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update state with fetched data
      setClient(data)
      setUpdateName(data.name)
      setUpdateEmail(data.email)
      setUpdatePhone(data.phone)
      setUpdateNote(data.note)
      setUpdateType(data.type)
      setUpdateStatus(data.status)
      setUpdateDeal(data.dealValue)
    } catch (error) {
      console.error("Failed to fetch client data", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [clientId])

  // This handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault()

    // If status is closed, deal value is required
    if (updateStatus === "closed" && !updateDeal) {
      notyf.error("Deal Value is required when status is set to 'Closed'")
      return
    }

    // Checking if token exists in local storage
    const token = localStorage.getItem("token")
    if (!token) return

    // Setting up the data to be sent to the API
    const data = { name: updateName, email: updateEmail }

    // If they are not empty, add them to the data object
    if (updatePhone) data.phone = updatePhone
    if (updateType) data.type = updateType
    if (updateNote) data.note = updateNote
    if (updateStatus) data.status = updateStatus
    if (updateDeal !== undefined) data.dealValue = +updateDeal

    try {
      await axios.patch(`${baseApiUrl}/client/${clientId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      notyf.success("Client updated successfully!")

      // Redirect to the clients page
      nav("/clients")
    } catch (error) {
      console.error("Failed to update client", error)
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  // If client data is not loaded yet, show loading message
  if (!client) return <Loading />

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col select-none dark:bg-neutral-900">
      <SideBar />
      <div className="flex flex-grow items-center justify-center py-10">
        <div className="bg-white w-full max-w-xl shadow-xl rounded-xl p-8 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6 dark:text-white">Edit Client</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Name</label>
              <input value={updateName || ""} onChange={(e) => setUpdateName(e.target.value)} type="text" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Email</label>
              <input value={updateEmail || ""} onChange={(e) => setUpdateEmail(e.target.value)} type="email" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Phone</label>
              <input value={updatePhone || ""} onChange={(e) => setUpdatePhone(e.target.value)} type="number" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Status</label>
              <select value={updateStatus || ""} onChange={(e) => setUpdateStatus(e.target.value)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300">
                <option value="" hidden>Please Select Status</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Type</label>
              <select value={updateType || ""} onChange={(e) => setUpdateType(e.target.value)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300">
                <option value="" hidden>Please Select Type</option>
                <option value="client">Client</option>
                <option value="potential">Potential</option>
                <option value="supplier">Supplier</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Deal Value</label>
              {updateStatus === "closed" && <p className='text-sm text-gray-500 dark:text-zinc-400'>This field is required when the client status is set to "Closed".</p>}
              <input value={updateDeal || ""} onChange={(e) => setUpdateDeal(e.target.value)} type="number" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-white">Note</label>
              <input value={updateNote || ""} onChange={(e) => setUpdateNote(e.target.value)} type="text" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition dark:bg-blue-900 dark:hover:bg-blue-800">Update Client</button>
            <button type="button" onClick={() => { nav("/clients"); setUpdateName(""); setUpdateEmail("") }} className="border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-400 dark:text-white">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  )
}