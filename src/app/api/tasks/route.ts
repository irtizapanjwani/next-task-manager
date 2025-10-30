import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all tasks with optional search
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  let tasks
  
  if (search) {
    // Search in title and description
    tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    })
  } else {
    tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    })
  }
  
  return NextResponse.json(tasks)
}

// POST new task
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: body.status || "pending",
      },
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
