export interface User {
  id?: string,
  status: 'Active',
  email: string,
  password: string,
  username: string,
  role: 'user' | 'admin'
}
