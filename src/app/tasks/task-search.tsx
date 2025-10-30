"use client"

import { useState } from "react"

export default function TaskSearch({
  onResults,
  onClear,
}: {
  onResults: (tasks: any[]) => void
  onClear: () => void
}) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/tasks?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      onResults(data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClear() {
    setQuery("")
    onClear()
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="bg-white border border-gray-300 px-3 py-2 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[80px]"
        >
          {isLoading ? "..." : "Search"}
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-600"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  )
}
