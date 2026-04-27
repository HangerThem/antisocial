import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{
    postId: string
  }>
}

export async function PATCH(req: Request, props: Props) {
  const { postId } = await props.params
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      preserved: true,
    },
  })

  return new Response(JSON.stringify({ preserved: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
