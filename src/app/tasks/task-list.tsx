"use client"

import { useTransition } from "react"

type Task = {
  id: number
  title: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks?.length) {
    return <p className="text-gray-500 text-sm">No tasks yet.</p>
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    })
    startTransition(() => {
      window.location.reload()
    })
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status,
      }),
    })
    startTransition(() => {
      window.location.reload()
    })
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
          className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          Done
        </button>
        <button
          onClick={() => handleStatusChange("in-progress")}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          In progress
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          {isPending ? "..." : "Delete"}
        </button>
      </div>
    </li>
  )
}
