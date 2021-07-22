// React
import { useEffect, useState } from "react";
// UI
import { Checkbox, Heading, majorScale, Pane, SortIcon, Text } from "evergreen-ui";

// Util
import moment, { Moment } from "moment";
import { MOMENT_DATE_FORMAT, MOMENT_TIME_FORMAT } from "./constants";
import { getTasks } from "./api";
import { Task } from "./types";

window.moment = moment;

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
          <SortIcon color="gray700" />
        </Pane>
			</Pane>
      {/* <HorizontalRule /> */}
      <Tasks />
		</Pane>
	);
}

const Tasks = (props = {}) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	
	useEffect(() => {
		const initTasks = async () => {
			try {
				const tasks = await getTasks();
				setTasks(tasks);
			} catch (e) {
				console.trace(e);
			}
		};
		initTasks();
	}, []);
	
	const handleTaskComplete = (idx: number) => () => {
		setTasks((currentTasks) => {
			const newTasks = currentTasks.slice();
			newTasks[idx].completed = !newTasks[idx].completed;
			
			return newTasks;
		})
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
							<Checkbox checked={task.completed} onChange={handleTaskComplete(idx)} />
							<Text
								marginLeft={majorScale(1)}
								textDecoration={
									task.completed ? "line-through" : "none"
								}
							>
								{task.content}
							</Text>
						</Pane>
					</Pane>
				))}
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
