import {
	Button,
	Checkbox,
	DeleteIcon,
	majorScale,
	Pane,
	TextInput
} from "evergreen-ui";
import { ChangeEvent } from "react";
import { ITask } from "../types";

interface ITaskProps {
	task: ITask;
	isLoading: boolean;
	handleRemoveTask: () => void;
	handleTaskContent: (e: ChangeEvent<HTMLInputElement>) => void;
	handleTaskComplete: () => void;
}

export function Task(props: ITaskProps) {
	const {
		handleRemoveTask,
		handleTaskContent,
		handleTaskComplete,
		isLoading,
		task
	} = props;
	return (
		<Pane>
			<Pane alignItems="center" display="flex">
				<Checkbox
					disabled={isLoading}
					checked={task.completed}
					onChange={handleTaskComplete}
				/>
				<TextInput
					disabled={isLoading}
					marginLeft={majorScale(2)}
					onChange={handleTaskContent}
					textDecoration={task.completed ? "line-through" : "none"}
					value={task.content}
					width="100%"
				/>
				<Button
					appearance="minimal"
					intent="danger"
					marginLeft={majorScale(1)}
					onClick={handleRemoveTask}
				>
					<DeleteIcon />
				</Button>
			</Pane>
		</Pane>
	);
}
