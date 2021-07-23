// React
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
// UI
import {
	AddIcon,
	Button,
	DeleteIcon,
	Checkbox,
	Heading,
	majorScale,
	minorScale,
	Pane,
	SortIcon,
	Text,
	Textarea,
	TextInput,
	toaster
} from "evergreen-ui";
import "./App.css"
// Util
import moment, { Moment } from "moment";
import { MOMENT_DATE_FORMAT, MOMENT_TIME_FORMAT } from "./constants";
import * as api from "./api";
import { Task } from "./types";

function App() {
	const [dateTime, setDateTime] = useState<Moment>(moment());

	useEffect(() => {
		const interval = setInterval(() => {
			setDateTime(moment());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Pane>
			<Pane display="flex" justifyContent="space-between" marginBottom={majorScale(5)}>
        		{/* Date Time and Sort Icon Header */}
				<Pane display="flex">
					<Heading fontWeight={800} size={800}>
						Today
					</Heading>
					<Text alignSelf="flex-end" marginLeft={10}>
						{dateTime.format(MOMENT_DATE_FORMAT)}{" "}
						{dateTime.format(MOMENT_TIME_FORMAT)}
					</Text>
				</Pane>
				<Pane>
					<Button className="icon-button">
						<SortIcon color="gray700" />
					</Button>
				</Pane>
			</Pane>
		<Tasks />
	</Pane>
	);
}

// TODO: Might use redux for loading states and such.
const Tasks = (props = {}) => {
	const [addTaskMode, setAddTaskMode] 		= useState<boolean>(false);
	const [isLoading, setLoading]				= useState<boolean>(false);
	const [newTaskContent, setNewTaskContent] 	= useState<string>("");
	const [tasks, setTasks] 					= useState<Task[]>([]);

	useEffect(() => {
		const initTasks = async () => {
			try {
				setLoading(true);
				const tasks = await api.getTasks();
				setTasks(tasks);
			} catch (err) {
				console.log(err);
				toaster.danger(err.message || "Error loading tasks");
			} finally {
				setLoading(false);
			}
		};
		initTasks();
	}, []);

	const toggleAddTaskMode = () => {
		setAddTaskMode(currentTaskMode => !currentTaskMode);
	}

	const clearNewTask = () => {
		setNewTaskContent("");
		setAddTaskMode(false);
	}
	

	const handleRemoveTask = (id: number) => async () => {
		try {
			setLoading(true);
			await api.removeTask(id);
			setTasks((currentTasks) =>
				currentTasks.filter((task) => task.id !== id)
			);
			toaster.notify("Task deleted successfully!");
		} catch (err) {
			console.log(err);
			toaster.danger(err.message || "Error completing task");
		} finally {
			setLoading(false);
		}
	}

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
			console.log(err);
			toaster.danger(err.message || "Error completing task");
		} finally {
			// Add set time out cause of animation delay on checkbox
			setTimeout(() => {
				setLoading(false);
			}, 50);
		}
	};

	const handleTaskContent = (idx: number) => (ev: ChangeEvent<HTMLInputElement>) => {
		setTasks((currentTasks) => {
			const newTasks = currentTasks.slice();
			newTasks[idx].content = ev.target.value;
			return newTasks;
		});
	}
	
	const handleNewTaskContent = (ev: ChangeEvent<HTMLTextAreaElement>) => {
		setNewTaskContent(ev.target.value);
	}
	
	const handleAddNewTask = async () => {
		try {
			setLoading(true);
			const task = await api.createTask({
				content: newTaskContent,
				completed: false
			});
			setTasks(currentTasks => [...currentTasks, task]);
			clearNewTask();
			toaster.notify("Task Added Successfully!");
		} catch (err) {
			console.log(err);
			toaster.danger(err.message || "Error adding task");
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
					<Pane key={idx}>
						<Pane alignItems="center" display="flex">
							<Checkbox disabled={isLoading} checked={task.completed} onChange={handleTaskComplete(idx)} />
							<TextInput disabled={isLoading} marginLeft={majorScale(2)} onChange={handleTaskContent(idx)} textDecoration={
									task.completed ? "line-through" : "none"
								} value={task.content} width="100%" />
							<Button appearance="minimal" intent="danger" marginLeft={majorScale(1)} onClick={handleRemoveTask(task.id)}>
								<DeleteIcon />
							</Button>
						</Pane>
					</Pane>
				))}
				<Pane>
						{addTaskMode ?
						(
							<Pane display="flex" flexDirection="column">
								<Pane marginBottom={majorScale(2)}>
									<Textarea fontSize={majorScale(2)} onChange={handleNewTaskContent} placeholder="Task..." width="100%" />
								</Pane>
								<Pane>
									<Button onClick={toggleAddTaskMode}>Cancel</Button>
									<Button appearance="primary" marginLeft={majorScale(2)} onClick={handleAddNewTask}>Add Task</Button>
								</Pane>
							</Pane>
						) : 
						(
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

const HorizontalRule = () => (
	<Pane
		borderColor="#eee"
		borderStyle="solid"
		marginY={majorScale(2)}
		border="0"
		borderTopWidth={1}
		height={1}
	/>
);

export default App;
