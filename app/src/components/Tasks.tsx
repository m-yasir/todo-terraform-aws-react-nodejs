import {
	AddIcon,
	Button,
	Heading,
	majorScale,
	minorScale,
	Pane,
	Text,
	Textarea,
	toaster
} from "evergreen-ui";
import { ChangeEvent, useEffect, useState } from "react";
import * as api from "../api";
import { HorizontalRule } from "./HorizontalRule";
import { Task } from "./Task";
import { ITask } from "../types";

// TODO: Use redux for loading states and such.
export function Tasks() {
	const [addTaskMode, setAddTaskMode] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [newTaskContent, setNewTaskContent] = useState<string>("");
	const [tasks, setTasks] = useState<ITask[]>([]);

	useEffect(() => {
		const initTasks = async () => {
			try {
				setLoading(true);
				const tasks = await api.getTasks();
				setTasks(tasks);
			} catch (err) {
				console.error("TASKS::initTasks => ", err);
				toaster.danger("Error loading tasks! Please contact an admin.");
			} finally {
				setLoading(false);
			}
		};
		initTasks();
	}, []);

	const toggleAddTaskMode = () => {
		setAddTaskMode((currentTaskMode) => !currentTaskMode);
	};

	const clearNewTask = () => {
		setNewTaskContent("");
		setAddTaskMode(false);
	};

	const handleRemoveTask = (id: number) => async () => {
		try {
			setLoading(true);
			await api.removeTask(id);
			setTasks((currentTasks) =>
				currentTasks.filter((task) => task.id !== id)
			);
			toaster.notify("Task deleted successfully!");
		} catch (err) {
			console.error("Tasks::handleRemoveTask => ", err);
			toaster.danger("Couldn't delete task! Please contact an admin.");
		} finally {
			setLoading(false);
		}
	};

	const handleTaskComplete = (idx: number) => async () => {
		try {
			// Add set time out cause of animation delay on checkbox
			setTimeout(() => {
				setLoading(true);
			}, 50);
			await api.updateTask({
				...tasks[idx],
				completed: !tasks[idx].completed
			});
			setTasks((currentTasks) => {
				const newTasks = currentTasks.slice();
				newTasks[idx].completed = !currentTasks[idx].completed;
				return newTasks;
			});
		} catch (err) {
			console.error("Tasks::handleRemoveTask => ", err);
			toaster.danger("Couldn't complete task! Please contact an admin.");
		} finally {
			// Add set time out cause of animation delay on checkbox
			setTimeout(() => {
				setLoading(false);
			}, 50);
		}
	};

	const handleTaskContent =
		(idx: number) => (ev: ChangeEvent<HTMLInputElement>) => {
			setTasks((currentTasks) => {
				const newTasks = currentTasks.slice();
				newTasks[idx].content = ev.target.value;
				return newTasks;
			});
		};

	const handleNewTaskContent = (ev: ChangeEvent<HTMLTextAreaElement>) => {
		setNewTaskContent(ev.target.value);
	};

	const handleAddNewTask = async () => {
		try {
			setLoading(true);
			const task = await api.createTask({
				content: newTaskContent,
				completed: false
			});
			setTasks((currentTasks) => [...currentTasks, task]);
			clearNewTask();
			toaster.notify("Task Added Successfully!");
		} catch (err) {
			console.log(err);
			toaster.danger("Couldn't add task! Please contact an admin.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Pane>
			<Heading fontWeight={600} fontSize={majorScale(2)}>
				Tasks
			</Heading>
			<HorizontalRule />
			<Pane display="flex" flexDirection="column">
				{tasks.map((task, idx) => (
					<Task
						key={task.id}
						task={task}
						isLoading={isLoading}
						handleTaskContent={handleTaskContent(idx)}
						handleTaskComplete={handleTaskComplete(idx)}
						handleRemoveTask={handleRemoveTask(idx)}
					/>
				))}
				<Pane>
					{addTaskMode ? (
						<Pane display="flex" flexDirection="column">
							<Pane marginBottom={majorScale(2)}>
								<Textarea
									fontSize={majorScale(2)}
									onChange={handleNewTaskContent}
									placeholder="Task..."
									width="100%"
								/>
							</Pane>
							<Pane>
								<Button onClick={toggleAddTaskMode}>
									Cancel
								</Button>
								<Button
									appearance="primary"
									marginLeft={majorScale(2)}
									onClick={handleAddNewTask}
								>
									Add Task
								</Button>
							</Pane>
						</Pane>
					) : (
						<Pane alignItems="center" display="flex">
							<Button
								appearance="minimal"
								display="flex"
								justifyContent="flex-start"
								alignItems="center"
								marginLeft={majorScale(1)}
								onClick={toggleAddTaskMode}
								width="100%"
							>
								<AddIcon size={minorScale(5)} />
								<Text marginLeft={majorScale(2)}>Add Task</Text>
							</Button>
						</Pane>
					)}
				</Pane>
			</Pane>
		</Pane>
	);
}
