import { UsersList } from '@/widgets/users-list'

export function UsersPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-bold">All Users</h1>
      </div>
      <UsersList />
    </div>
  )
}
