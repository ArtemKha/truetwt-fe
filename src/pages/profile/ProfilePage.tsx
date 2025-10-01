import { useParams } from 'react-router-dom'
import { UserPosts } from '@/widgets/user-posts'
import { UserProfile } from '@/widgets/user-profile'

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()

  if (!userId) {
    return <div>User not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
    </div>
  )
}
