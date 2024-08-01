import { User } from "./auth.model";

export interface Task {
  id?: string,
  title: string,
  deadline: Date,
  description: string,
  image: string,
  user: User
  status: TaskStatus
}

export type TaskStatus = 'In-Progress' | 'Completed'