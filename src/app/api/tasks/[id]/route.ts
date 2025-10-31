import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET single task (only if user owns it)
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { id } = await context.params
  const taskId = Number(id)

  const task = await prisma.task.findFirst({
    where: { 
      id: taskId,
      userId: userId, // Only get if user owns it
    },
  })

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

// PUT (update) - only if user owns the task
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { id } = await context.params
  const taskId = Number(id)
  const data = await req.json()

  // Check if task exists and user owns it
  const existingTask = await prisma.task.findFirst({
    where: { 
      id: taskId,
      userId: userId,
    },
  })

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
    },
  })

  return NextResponse.json(updated)
}

// DELETE - only if user owns the task
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { id } = await context.params
  const taskId = Number(id)

  // Check if task exists and user owns it
  const existingTask = await prisma.task.findFirst({
    where: { 
      id: taskId,
      userId: userId,
    },
  })

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 })
  }

  await prisma.task.delete({
    where: { id: taskId },
  })

  return NextResponse.json({ message: "Task deleted" })
}
