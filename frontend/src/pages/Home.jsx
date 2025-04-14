import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Loading from '../components/Loading'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters, isWithinInterval } from 'date-fns';
import { initTheme } from "../utils/DarkMode"

export default function Home() {
  const nav = useNavigate()
  const [clientsList, setClientsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAdmin } = useAuth()

  // Set theme mode
  initTheme()

  // This is the base URL for the API.
  const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

  // Fetch clients data from the API
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
      if (error.response.status === 401 || error.response.status === 403) return nav("/login")
    } finally {
      // Set loading state to false after fetching data
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin !== null) {
      getClients()
    }
  }, [isAdmin])

  // Function to calculate percentage difference
  const calcPercentDiff = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const now = new Date()

  const thisWeek = {
    start: startOfWeek(now, { weekStartsOn: 0 }),
    end: endOfWeek(now, { weekStartsOn: 0 })
  }

  const lastWeek = {
    start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }),
    end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
  }

  const thisMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now)
  }

  const lastMonth = {
    start: startOfMonth(subMonths(now, 1)),
    end: endOfMonth(subMonths(now, 1))
  }

  const currentQuarter = {
    start: startOfQuarter(now),
    end: endOfQuarter(now)
  }

  const previousQuarter = {
    start: startOfQuarter(subQuarters(now, 1)),
    end: endOfQuarter(subQuarters(now, 1))
  }

  // Clients added this week and last week
  const clientsAddedThisWeek = clientsList.filter(c => isWithinInterval(new Date(c.createdAt), thisWeek))
  const clientsAddedLastWeek = clientsList.filter(c => isWithinInterval(new Date(c.createdAt), lastWeek))

  // Clients closed this week and last week
  const clientsClosedThisWeek = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), thisWeek))
  const clientsClosedLastWeek = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), lastWeek))

  // Pending clients from this week (limited to the latest 5)
  const pendingClients = clientsList.filter(c => c.status === "pending" && isWithinInterval(new Date(c.createdAt), thisWeek))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Calculate percentage differences for weekly data
  const addedDiff = calcPercentDiff(clientsAddedThisWeek.length, clientsAddedLastWeek.length)
  const closedDiff = calcPercentDiff(clientsClosedThisWeek.length, clientsClosedLastWeek.length)

  // Weekly revenue
  const totalRevenueThisWeek = clientsClosedThisWeek.reduce((sum, client) => sum + +client.dealValue, 0)

  // Clients added this month and last month
  const clientsAddedThisMonth = clientsList.filter(c => isWithinInterval(new Date(c.createdAt), thisMonth))
  const clientsAddedLastMonth = clientsList.filter(c => isWithinInterval(new Date(c.createdAt), lastMonth))

  // Clients closed this month and last month
  const clientsClosedThisMonth = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), thisMonth))
  const clientsClosedLastMonth = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), lastMonth))

  // Monthly revenue
  const totalRevenueThisMonth = clientsClosedThisMonth.reduce((sum, client) => sum + +client.dealValue, 0)
  const totalRevenueLastMonth = clientsClosedLastMonth.reduce((sum, client) => sum + +client.dealValue, 0)

  // Monthly percentage differences
  const addedDiffMonth = calcPercentDiff(clientsAddedThisMonth.length, clientsAddedLastMonth.length)
  const closedDiffMonth = calcPercentDiff(clientsClosedThisMonth.length, clientsClosedLastMonth.length)
  const revenueDiffMonth = calcPercentDiff(totalRevenueThisMonth, totalRevenueLastMonth)

  // Clients added this quarter and last quarter
  const clientsClosedCurrentQuarter = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), currentQuarter))
  const clientsClosedPreviousQuarter = clientsList.filter(c => c.status === "closed" && isWithinInterval(new Date(c.updatedAt), previousQuarter))

  // Quarter revenue
  const totalRevenueCurrentQuarter = clientsClosedCurrentQuarter.reduce((sum, client) => sum + +client.dealValue, 0)
  const totalRevenuePreviousQuarter = clientsClosedPreviousQuarter.reduce((sum, client) => sum + +client.dealValue, 0)

  // Quarter percentage differences
  const revenueDiffQuarter = calcPercentDiff(totalRevenueCurrentQuarter, totalRevenuePreviousQuarter)

  // Average deal value for closed deals this month
  const averageDeal = clientsClosedThisMonth.length > 0 ? totalRevenueThisMonth / clientsClosedThisMonth.length : 0

  const recentClients = [...clientsList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  if (isLoading) {
    return <Loading />
  }

  if (isAdmin) {
    return (
      <div className="bg-gray-200 min-h-screen select-none dark:bg-neutral-900">
        <SideBar />
        <div className="lg:ml-[130px] p-4">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Admin Dashboard</h1>
          < p className="text-sm text-gray-600 mb-6 dark:text-zinc-300" >
            Here you can see the up-to-date data on clients and revenue. Each metric comes with a brief explanation of its significance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Clients Added This Month */}
            <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Clients Added This Month</h3>
              <p className="text-3xl font-bold dark:text-white">{clientsAddedThisMonth.length}</p>
              <p className={`text-sm ${addedDiffMonth >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
                ({addedDiffMonth.toFixed(0)}% {addedDiffMonth >= 0 ? "↑" : "↓"})
              </p>
              < p className="text-xs text-gray-500 mt-2 dark:text-zinc-300" >
                Number of new clients added this month. An increase indicates growing activity.
              </p>
            </div>

            {/* Clients Closed This Month */}
            <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Clients Closed This Month</h3>
              <p className="text-3xl font-bold dark:text-white">{clientsClosedThisMonth.length}</p>
              <p className={`text-sm ${closedDiffMonth >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
                ({closedDiffMonth.toFixed(0)}% {closedDiffMonth >= 0 ? "↑" : "↓"})
              </p>
              <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
                Number of deals closed this month—a key sales performance metric.
              </p>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Total Revenue This Month</h3>
              <p className="text-3xl font-bold dark:text-white">
                ${totalRevenueThisMonth.toLocaleString()}
              </p>
              <p className={`text-sm ${revenueDiffMonth >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
                ({revenueDiffMonth.toFixed(0)}% {revenueDiffMonth >= 0 ? "↑" : "↓"})
              </p>
              <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
                Total revenue from closed deals this month. An upward trend shows strong performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Current Quarter Revenue */}
            <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Current Quarter Revenue</h3>
              <p className="text-3xl font-bold dark:text-white">
                ${totalRevenueCurrentQuarter.toLocaleString()}
              </p>
              <p className={`text-sm ${revenueDiffQuarter >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
                ({revenueDiffQuarter.toFixed(0)}% {revenueDiffQuarter >= 0 ? "↑" : "↓"})
              </p>
              <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
                Comparison of the current quarter's revenue to the previous quarter.
              </p>
            </div>

            {/* Average Deal */}
            <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Average Monthly Deal</h3>
              <p className="text-3xl font-bold dark:text-white">
                ${averageDeal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
                The average value of closed deals, helping you assess deal sizes.
              </p>
            </div>
          </div>

          {/* Recent Clients */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Recent Clients</h2>
            <div className="space-y-2">
              {recentClients.length > 0 ? (
                recentClients.map(client => (
                  <div
                    key={client._id}
                    className="bg-white p-3 rounded-md shadow-sm hover:shadow transition duration-150 dark:bg-zinc-700"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{client.name}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-300">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-col text-xs text-gray-600 dark:text-zinc-300">
                      <span>Email: {client.email}</span>
                      {client.phone && <span>Phone: {client.phone}</span>}
                      <span>Status: {client.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No recent clients found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Non-admin view
  return (
    <div className='bg-gray-200 min-h-screen dark:bg-neutral-900'>
      <SideBar />
      <div className="lg:ml-[130px] p-4">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 mb-6 dark:text-zinc-300">
          Here you can view the latest weekly activity. Each metric includes a brief explanation to help you understand the data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Clients Added This Week */}
          <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">Clients Added This Week</h3>
            <p className="text-3xl font-bold dark:text-white">{clientsAddedThisWeek.length}</p>
            <p className={`text-sm ${addedDiff >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
              ({addedDiff.toFixed(0)}% {addedDiff >= 0 ? "↑" : "↓"})
            </p>
            <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
              Number of clients registered this week. Comparing with last week provides a growth metric.
            </p>
          </div>

          {/* Clients Closed This Week */}
          <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">Clients Closed This Week</h3>
            <p className="text-3xl font-bold dark:text-white">{clientsClosedThisWeek.length}</p>
            <p className={`text-sm ${closedDiff >= 0 ? "text-green-600" : "text-red-600"} mt-1`}>
              ({closedDiff.toFixed(0)}% {closedDiff >= 0 ? "↑" : "↓"})
            </p>
            <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
              Number of deals closed this week—a metric of sales performance.
            </p>
          </div>

          {/* Weekly Revenue */}
          <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">Revenue This Week</h3>
            <p className="text-3xl font-bold dark:text-white">
              ${totalRevenueThisWeek.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
              Total revenue from deals closed during the current week.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Pending Clients */}
          <div className="bg-white p-4 rounded shadow dark:bg-zinc-700">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">Latest Pending Clients</h3>
            {pendingClients.length > 0 ? (
              <ul>
                {pendingClients.map(client => (
                  <li key={client._id} className="border-b border-gray-200 py-2 last:border-b-0">
                    <p className="font-medium dark:text-white">{client.name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-300">
                      Created on: {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-xs mt-2 dark:text-zinc-300">No pending clients found for this week.</p>
            )}
          </div>

          {/* Total Clients */}
          <div className="bg-white p-4 rounded shadow flex flex-col dark:bg-zinc-700">
            <h3 className="text-lg font-semibold mb-1 dark:text-white">Total Clients</h3>
            <p className="text-3xl font-bold dark:text-white">{clientsList.length}</p>
            <p className="text-xs text-gray-500 mt-2 dark:text-zinc-300">
              Total number of clients in the system, including both active and past deals.
            </p>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Recent Clients</h2>
          <div className="space-y-2">
            {recentClients.length > 0 ? (
              recentClients.map(client => (
                <div
                  key={client._id}
                  className="bg-white p-3 rounded-md shadow-sm hover:shadow transition duration-150 dark:bg-zinc-700"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{client.name}</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-300">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col text-xs text-gray-600 dark:text-zinc-300">
                    <span>Email: {client.email}</span>
                    {client.phone && <span>Phone: {client.phone}</span>}
                    <span>Status: {client.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-zinc-300">No recent clients found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}