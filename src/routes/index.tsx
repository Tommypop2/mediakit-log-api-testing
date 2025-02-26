import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import Counter from "~/components/Counter";
import { LogInfo, LogProvider, log$ } from "~/components/LogContext";
const serverLog = (d: any, metadata?: LogInfo) => {
	"use server";
	console.log("Server logging with Mediakit!", d);
};
const clientLog = (d: any, metadata?: LogInfo) => {
	console.log("Client Logging with Mediakit!", d);
};
export default function Home() {
	return (
		<LogProvider
			loggers={[
				{
					executor: "clientOnly",
					log: clientLog,
				},
				{ executor: "clientOnly", log: serverLog },
			]}
		>
			{(() => {
				const [count, setCount] = createSignal(0);
				log$(count);
				return <Counter count={count} setCount={setCount} />;
			})()}
		</LogProvider>
	);
}
