import { majorScale, Pane } from "evergreen-ui";

export function HorizontalRule() {
	return (
		<Pane
			borderColor="#eee"
			borderStyle="solid"
			marginY={majorScale(2)}
			border="0"
			borderTopWidth={1}
			height={1}
		/>
	);
}
