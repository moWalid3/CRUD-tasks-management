export interface User {
  id?: string,
  username: string,
  email: string,
  password: string,
  status: UserStatus,
  role: 'user' | 'admin'
}

export type UserStatus = 'active' | 'non-active'