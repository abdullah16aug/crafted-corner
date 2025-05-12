import type { Access } from 'payload'

export const admins: Access = ({ req: { user } }) => {
  if (!user) return false
  return 'role' in user && user.role.includes('admin')
}
