"use client"

import { useState, useTransition } from "react"

export default function AddTaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })

    setTitle("")
    setDescription("")

    // refresh data
    startTransition(() => {
      window.location.reload()
    })
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
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {isPending ? "Adding..." : "Add Task"}
      </button>
    </form>
  )
}
