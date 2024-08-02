export interface User {
  id?: string,
  status: 'active' | 'in-active',
  email: string,
  password: string,
  username: string,
  role: 'user' | 'admin',
  total_tasks?: number
}
