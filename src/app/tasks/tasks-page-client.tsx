"use client"

import { useState, useCallback } from "react"
import TaskList from "./task-list"
import AddTaskForm from "./task-form"
import TaskSearch from "./task-search"

type Task = {
  id: number
  title: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export default function TasksPageClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isSearching, setIsSearching] = useState(false)

  const refreshTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const newTasks = await res.json()
        setTasks(newTasks)
        if (!isSearching) {
          // Update initial tasks reference for clear search
          initialTasks.splice(0, initialTasks.length, ...newTasks)
        }
      }
    } catch (error) {
      console.error('Failed to refresh tasks:', error)
    }
  }, [isSearching])

  const handleSearchResults = (searchResults: Task[]) => {
    setTasks(searchResults)
    setIsSearching(true)
  }

  const handleClearSearch = () => {
    setTasks(initialTasks)
    setIsSearching(false)
  }

  const handleTaskAdded = () => {
    if (!isSearching) {
      refreshTasks()
    }
  }

  const handleTaskUpdated = () => {
    if (!isSearching) {
      refreshTasks()
    }
  }

  return (
    <>
      <AddTaskForm onTaskAdded={handleTaskAdded} />
      
      <div className="space-y-4">
        <TaskSearch 
          onResults={handleSearchResults}
          onClear={handleClearSearch}
        />
        
        {isSearching && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {tasks.length} search result{tasks.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Show all tasks
            </button>
          </div>
        )}
        
        <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
      </div>
    </>
  )
}