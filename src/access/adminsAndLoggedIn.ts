import type { Access } from 'payload'

const adminsAndLoggedIn: Access = ({ req: { user } }) => {
  if (!user) return false
  return true
}

export default adminsAndLoggedIn
