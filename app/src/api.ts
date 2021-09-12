import { _fetch } from "./helper";
import { ITask, TaskPayload } from "./types";

// API UTIL
function getAPIUrl(resource: string) {
	return process.env.REACT_APP_API_URL + resource;
}

// TODO: For Scalability, when user support is added, move entity endpoints to their respective folders.
async function getTasks(): Promise<ITask[]> {
	return _fetch<ITask[]>(getAPIUrl("/todo"));
}

async function createTask(task: TaskPayload): Promise<ITask> {
	return _fetch<ITask>(getAPIUrl("/todo"), "POST", task);
}

async function updateTask(task: ITask): Promise<ITask> {
	return _fetch<ITask>(`${getAPIUrl("/todo")}/${task.id}`, "PATCH", task);
}

async function removeTask(id: number): Promise<void> {
	return _fetch(`${getAPIUrl("/todo")}/${id}`, "DELETE");
}

export { createTask, getTasks, removeTask, updateTask };
