// UTIL Types

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// App Types and interfaces
export interface Task {
    id: number;
    content: string;
    completed: boolean;
    createdAt: Date;
}

export type TaskPayload = PartialBy<Task, "id" | "createdAt">;
