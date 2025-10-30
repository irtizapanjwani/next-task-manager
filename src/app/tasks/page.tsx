import { prisma } from "@/lib/prisma"
import TasksPageClient from "./tasks-page-client"
import Link from "next/link"

export const dynamic = "force-dynamic" // so it always fetches latest

export default async function TasksPage() {
    const tasks = await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <main className="mx-auto max-w-2xl p-6 space-y-6">
            <div>
                <Link
                    href="/"
                    className="bg-gray-500 px-2 py-2 rounded-xl inline-block mb-4 text-sm text-white hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                >
                    Back to Home
                </Link>

                <h1 className="text-2xl font-bold">Task Manager</h1>
                <p className="text-sm text-gray-500">
                    Create, Read, Update, Delete Operations
                </p>
            </div>

            <TasksPageClient initialTasks={tasks} />
        </main>
    )
}
