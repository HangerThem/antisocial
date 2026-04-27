"use client"

import { Post } from "@prisma/client"
import { useEffect, useState } from "react"
import { EXPIRATION } from "@/constants/expiration"

function getSince(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return seconds === 1 ? "1 second" : `${seconds} seconds`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes === 1 ? "1 minute" : `${minutes} minutes`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? "1 hour" : `${hours} hours`

  const days = Math.floor(hours / 24)
  if (days < 30) return days === 1 ? "1 day" : `${days} days`

  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? "1 month" : `${months} months`

  const years = Math.floor(days / 365)
  return years === 1 ? "1 year" : `${years} years`
}

function getExpiresIn(date: Date): string {
  const seconds = Math.floor(
    (new Date(date).getTime() + EXPIRATION * 1000 - Date.now()) / 1000,
  )

  if (seconds < 60) return seconds === 1 ? "1 second" : `${seconds} seconds`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes === 1 ? "1 minute" : `${minutes} minutes`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? "1 hour" : `${hours} hours`

  const days = Math.floor(hours / 24)
  if (days < 30) return days === 1 ? "1 day" : `${days} days`

  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? "1 month" : `${months} months`

  const years = Math.floor(days / 365)
  return years === 1 ? "1 year" : `${years} years`
}

export default function Home() {
  const [content, setContent] = useState<string>("")
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const populatePosts = async () => {
      const res = await fetch("/api/post")

      const fetchedPosts = await res.json()

      setPosts(fetchedPosts)
    }

    void populatePosts()
  }, [])

  const addPost = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (content.length < 80) return

    setContent("")

    const res = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    })

    const newPost = await res.json()

    setPosts((prev) => [newPost, ...prev])
  }

  const preservePost = async (id: string) => {
    const postToPreserve = posts.find((post) => post.id === id)

    if (!postToPreserve) return

    await fetch(`/api/post/${id}/preserve`, {
      method: "PATCH",
    })

    setPosts((prev) =>
      [
        ...prev.filter((post) => post.id !== id),
        { ...postToPreserve, preserved: true },
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    )
  }

  return (
    <div className="mx-auto my-4 max-w-xl w-full flex flex-col h-[calc(100vh-2rem)]">
      <header>
        <h1 className="uppercase">
          <span className="text-amber-500 font-medium">anti</span>
          social
        </h1>
      </header>

      <form className="flex flex-col" onSubmit={addPost}>
        <textarea
          className={`border  border-2 h-32 resize-none p-2 outline-none
            ${content.length < 80 ? "border-neutral-600" : "border-amber-500"}
            `}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs">{content.length} / 80 min</span>
          <button
            disabled={content.length < 80}
            className="disabled:bg-neutral-600 bg-amber-500 w-fit px-4 py-1 disabled:text-neutral-800 text-neutral-900 disabled:cursor-not-allowed cursor-pointer"
            type="submit"
          >
            Commit
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col min-h-0 overflow-y-auto -mr-2 pr-2">
        {posts.map((post) => (
          <div key={post.id} className="mt-4 border-l-2 pl-2 space-y-1">
            <div className="text-xs flex gap-1 items-center">
              <span>{new Date(post.createdAt).toISOString()}</span>
              <span>·</span>
              <span>commited {getSince(post.createdAt)} ago</span>
            </div>
            <p className="break-words leading-tight">{post.content}</p>
            {post.preserved ? (
              <div className="text-xs flex items-center gap-1">
                <span>{post.content.length} chars</span>
                <p>preserved</p>
              </div>
            ) : (
              <div className="text-xs flex items-center gap-1">
                <span>{post.content.length} chars</span>
                <p>expires in {getExpiresIn(post.createdAt)}</p>
                <span>·</span>
                <button onClick={() => preservePost(post.id)}>preserve</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
