import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Task Manager</h1>
      <p className="text-gray-600 max-w-md">
        Organize your tasks efficiently with our simple and powerful task management system.
      </p>
      
      {session ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {session.user?.name || session.user?.email}!</p>
          <Link
            href="/tasks"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-block"
          >
            Go to My Tasks
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">Please sign in to manage your tasks</p>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
