"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"

export default function TaskHeader({ user }: { user: any }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <Link
          href="/"
          className="bg-gray-500 px-2 py-2 rounded-xl inline-block mb-4 text-sm text-white hover:bg-gray-800 transition-colors duration-300 ease-in-out"
        >
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>
      
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  )
}