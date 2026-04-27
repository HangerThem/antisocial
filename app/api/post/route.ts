import { EXPIRATION } from "@/constants/expiration"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const postsToKeep = posts.filter(
    (post) =>
      (new Date().getTime() - new Date(post.createdAt).getTime()) / 1000 <
        EXPIRATION || post.preserved,
  )

  await prisma.post.deleteMany({
    where: {
      id: {
        notIn: postsToKeep.map((post) => post.id),
      },
    },
  })

  return new Response(JSON.stringify(postsToKeep), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export async function POST(req: Request) {
  const body = await req.json()

  const newPost = await prisma.post.create({
    data: {
      ...body,
    },
  })

  return new Response(JSON.stringify(newPost), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
