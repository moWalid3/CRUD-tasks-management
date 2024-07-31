import { User } from "./auth.model";

export interface Task {
  id?: string,
  title: string,
  user: User,
  image: string,
  status: Status,
  deadline: Date,
  description: string
}

export type Status = 'In-Progress' | 'Completed'