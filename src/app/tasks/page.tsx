import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import TasksPageClient from "./tasks-page-client"
import TaskHeader from "./task-header"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    // Dynamic import to avoid Prisma client issues
    const { prisma } = await import("@/lib/prisma")

    // Only get tasks for the current user
    const tasks = await prisma.task.findMany({
        where: {
            userId: session.user.id, // Filter by current user's ID
        } as any,
        orderBy: { createdAt: "desc" },
    })

    // Convert dates to strings for client component
    const serializedTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
    }))

    return (
        <main className="mx-auto max-w-2xl p-6 space-y-6">
            <TaskHeader user={session.user} />
            <TasksPageClient initialTasks={serializedTasks} />
        </main>
    )
}