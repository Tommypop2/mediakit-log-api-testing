import { createSignal } from "solid-js";
import "./Counter.css";
import { $log } from "./LogContext";

export default function Counter() {
	const [count, setCount] = createSignal(0);
	$log(count);
	return (
		<button
			class="increment"
			onClick={() => setCount(count() + 1)}
			type="button"
		>
			Clicks: {count()}
		</button>
	);
}
