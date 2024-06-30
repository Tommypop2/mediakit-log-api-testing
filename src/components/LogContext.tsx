import {
	ParentComponent,
	createContext,
	createEffect,
	useContext,
} from "solid-js";
class LogHandler {
	onLog(log: Log<any>) {}
}
class ExampleLogger {
	onLog(log: Log<any>) {
		if (log.metadata)
			console.log(
				`Output: ${log.data}, on line ${log.metadata.origin.line} in file ${log.metadata.origin.filename}`
			);
		else console.log(`Output: ${log.data}`);
	}
}
class ExampleServerLogger {
	onLog = (log: Log<any>) => {
		"use server";
		if (log.metadata)
			console.log(
				`Output: ${log.data}, on line ${log.metadata.origin.line} in file ${log.metadata.origin.filename}`
			);
		else console.log(`Output: ${log.data}`);
	};
}
type LogMetadata = {
	origin: { filename: string; line: number };
};
type Log<T> = {
	// Compiler would provide
	metadata?: LogMetadata;
	data: T;
};
type LoggerData = { handlers: LogHandler[] };
export const LoggerContext = createContext<LoggerData>();
export const LogProvider: ParentComponent = (props) => {
	return (
		// This would be a default implementation. Users could override this and provide a different `LogHandler`
		// The user can also provide multiple handlers to do different things with their logs
		<LoggerContext.Provider
			value={{ handlers: [new ExampleLogger(), new ExampleServerLogger()] }}
		>
			{props.children}
		</LoggerContext.Provider>
	);
};

export const useLoggerContext = () => {
	const ctx = useContext(LoggerContext);
	if (!ctx) throw new Error("Provider is not defined");
	return ctx;
};
export const $log = <T,>(fn: () => T, metadata?: LogMetadata) => {
	const ctx = useLoggerContext();
	createEffect(() => {
		const data = fn();
		ctx.handlers.forEach((h) => h.onLog({ data, metadata }));
	});
};
