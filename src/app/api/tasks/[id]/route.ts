import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET single task
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const taskId = Number(id)

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  })

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

// PUT (update)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const taskId = Number(id)
  const data = await req.json()

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

// DELETE
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const taskId = Number(id)

  await prisma.task.delete({
    where: { id: taskId },
  })

  return NextResponse.json({ message: "Task deleted" })
}
