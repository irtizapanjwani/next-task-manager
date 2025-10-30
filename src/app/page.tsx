import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Task Manager</h1>
      <Link
        href="/tasks"
        className="bg-green-400 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Go to Tasks
      </Link>
    </main>
  )
}
