import { Task } from "./types";

async function getTasks(): Promise<Task[]> {
	return Promise.resolve([
		{ id: 1, content: "First", completed: false, createdAt: new Date() },
		{ id: 2, content: "Second", completed: false, createdAt: new Date() },
		{ id: 3, content: "Third", completed: false, createdAt: new Date() },
		{ id: 4, content: "Fourth", completed: false, createdAt: new Date() },
	]);
}

async function updateTask(task: Task): Promise<Task> {
	return Promise.resolve(task);
}

async function removeTask(taskId: number): Promise<void> {
	return Promise.resolve();
}

export { getTasks, updateTask, removeTask };
