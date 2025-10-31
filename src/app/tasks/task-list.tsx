"use client"

import { useState } from "react"

type Task = {
  id: number
  title: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function TaskList({ tasks, onTaskUpdated }: { 
  tasks: Task[]
  onTaskUpdated?: () => void 
}) {
  if (!tasks?.length) {
    return <p className="text-gray-500 text-sm">No tasks yet.</p>
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
      ))}
    </ul>
  )
}

function TaskItem({ task, onTaskUpdated }: { 
  task: Task
  onTaskUpdated?: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        onTaskUpdated?.() // Notify parent to refresh tasks
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(status: string) {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status,
        }),
      })
      if (res.ok) {
        onTaskUpdated?.() // Notify parent to refresh tasks
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li className="border rounded-lg p-4 flex items-start justify-between gap-4 bg-white">
      <div>
        <h2 className="text-blue-600">{task.title}</h2>
        {task.description && (
          <p className="text-sm text-black">{task.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Status: <span className="font-medium">{task.status}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange("done")}
          disabled={isLoading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50"
        >
          Done
        </button>
        <button
          onClick={() => handleStatusChange("in-progress")}
          disabled={isLoading}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50"
        >
          In progress
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "..." : "Delete"}
        </button>
      </div>
    </li>
  )
}
