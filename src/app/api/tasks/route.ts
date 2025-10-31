import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET all tasks with optional search (filtered by user)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  let tasks
  
  if (search) {
    // Search in title and description for current user only
    tasks = await prisma.task.findMany({
      where: {
        userId: userId, // Filter by current user
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
      where: {
        userId: userId, // Filter by current user
      },
      orderBy: { createdAt: "desc" },
    })
  }
  
  return NextResponse.json(tasks)
}

// POST new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: body.status || "pending",
        userId: userId, // Link task to current user
      },
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
