import { CreatePost } from '@/features/posts/create-post'
import { Timeline } from '@/widgets/timeline'

export function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-bold mb-4">Home</h1>
        <CreatePost />
      </div>
      <Timeline />
    </div>
  )
}
