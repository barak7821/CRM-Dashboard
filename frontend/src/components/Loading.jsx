import React from 'react'
import SideBar from './SideBar'

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-neutral-900">
            <SideBar />
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 text-lg dark:text-white">Loading...</p>
            </div>
        </div>
    )
}