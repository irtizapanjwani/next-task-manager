"use client"

import { useState } from "react"

export default function AddTaskForm({ onTaskAdded }: { onTaskAdded?: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })

      if (res.ok) {
        setTitle("")
        setDescription("")
        onTaskAdded?.() // Notify parent to refresh tasks
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded-lg">
      <input
        type="text"
        required
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded px-3 py-2 text-black"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2 text-black"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  )
}
