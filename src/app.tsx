import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import {
	ExecutionLocation,
	Log,
	LogHandler,
	LogProvider,
} from "../logger/LogContext";
class CustomHandler extends LogHandler {
	execution: ExecutionLocation = "client";
	onLog(log: Log): void {
		console.log(log.data);
	}
}
class ServerLogger extends LogHandler {
	execution: ExecutionLocation = "both";
	onLog = (log: Log) => {
		"use server";
		console.log(log.data)
	}
}
export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<LogProvider handlers={[new CustomHandler(), new ServerLogger()]}>
						<Title>SolidStart - Basic</Title>
						<a href="/">Index</a>
						<a href="/about">About</a>
						<Suspense>{props.children}</Suspense>
					</LogProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
