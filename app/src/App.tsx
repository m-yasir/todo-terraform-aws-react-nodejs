// React
import { useEffect, useState } from "react";
// UI
import {
	Button,
	Heading,
	majorScale,
	Pane,
	SortIcon,
	Text,
	toaster
} from "evergreen-ui";
import "./App.css";
// Util
import moment, { Moment } from "moment";
import { MOMENT_DATE_FORMAT, MOMENT_TIME_FORMAT } from "./constants";
import { Tasks } from "./components/Tasks";

function App() {
	const [dateTime, setDateTime] = useState<Moment>(moment());

	/**
	 * Setup live clock
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			setDateTime(moment());
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	
	const onSort = () => {
		toaster.notify("Feature coming soon!", { id: 'sort' });
	};

	return (
		<Pane>
			<Pane
				display="flex"
				justifyContent="space-between"
				marginBottom={majorScale(5)}
			>
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
					<Button onClick={onSort} className="icon-button">
						<SortIcon color="gray700" />
					</Button>
				</Pane>
			</Pane>
			<Tasks />
		</Pane>
	);
}

export default App;
