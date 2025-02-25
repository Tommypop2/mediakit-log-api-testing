import { Accessor, Setter } from "solid-js";
import "./Counter.css";

export default function Counter(props: {
	count: Accessor<number>;
	setCount: Setter<number>;
}) {
	return (
		<button
			class="increment"
			onClick={() => props.setCount(props.count() + 1)}
			type="button"
		>
			Clicks: {props.count()}
		</button>
	);
}
