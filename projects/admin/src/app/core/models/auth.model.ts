export interface User {
  id?: string,
  status: 'active',
  email: string,
  password: string,
  username: string,
  role: 'user' | 'admin'
}
