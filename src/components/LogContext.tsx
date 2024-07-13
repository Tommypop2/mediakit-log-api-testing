import {
	ParentComponent,
	createContext,
	createEffect,
	on,
	untrack,
	useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
type ExecutionLocation = "server" | "client" | "both";
class LogHandler {
	execution: ExecutionLocation = "both";
	onLog(log: Log<any>) {
		throw new Error("This method should be overridden");
	}
}
class ExampleLogger extends LogHandler {
	onLog(log: Log<any>) {
		if (log.metadata)
			console.log(
				`(${log.origin.server ? "Server" : "Client"}) Output: ${
					log.data
				}, on line ${log.metadata.location.line} in file ${
					log.metadata.location.filename
				}`
			);
		else
			console.log(
				`(${log.origin.server ? "Server" : "Client"}) Output: ${log.data}`
			);
	}
}
class ExampleServerLogger extends LogHandler {
	onLog = (log: Log<any>) => {
		"use server";
		if (log.metadata)
			console.log(
				`(${log.origin.server ? "Server" : "Client"}) Output: ${
					log.data
				}, on line ${log.metadata.location.line} in file ${
					log.metadata.location.filename
				}`
			);
		else
			console.log(
				`(${log.origin.server ? "Server" : "Client"}) Output: ${log.data}`
			);
	};
}
type LogMetadata = {
	location: { filename: string; line: number };
};
type Log<T> = {
	// Compiler would provide metadata object in `$log` call
	metadata?: LogMetadata;
	origin: { server: boolean };
	data: T;
};
// Allow the user to specify multiple handlers that are all called
// type LoggerData = {
// 	/**
// 	 * Log handlers which run on the server when `log$` is called
// 	 */
// 	serverHandlers: LogHandler[];
// 	/**
// 	 * Log handlers which run on the client when `log$` is called. They don't run at all if called on the server
// 	 */
// 	clientHandlers: LogHandler[];
// };
type LoggerData = {
	handlers: LogHandler[];
};
export const LoggerContext = createContext<LoggerData>();
export const LogProvider: ParentComponent = (props) => {
	return (
		<LoggerContext.Provider
			value={{
				handlers: [new ExampleLogger(), new ExampleServerLogger()],
			}}
		>
			{props.children}
		</LoggerContext.Provider>
	);
};

export const useLoggerContext = () => {
	const ctx = useContext(LoggerContext);
	if (!ctx) throw new Error("No `LogProvider` in tree");
	return ctx;
};
export const $log = <T,>(fn: () => T, metadata?: LogMetadata) => {
	const ctx = useLoggerContext();
	createEffect(
		on(
			fn,
			(data) => {
				// Include extra deep tracking logic here in the future
				ctx.handlers.forEach((h) =>
					h.onLog({ data, metadata, origin: { server: isServer } })
				);
			},
			{ defer: true }
		)
	);
	const data = untrack(fn);
	// Don't execute non-ssr handlers on the server
	ctx.handlers.forEach((h) =>
		isServer && h.execution == "client"
			? {}
			: h.onLog({ data, metadata, origin: { server: isServer } })
	);
};
