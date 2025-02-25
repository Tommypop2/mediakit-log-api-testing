import {
	createContext,
	createEffect,
	on,
	ParentComponent,
	untrack,
	useContext,
} from "solid-js";
export type LogInfo = {
	line: number;
	file: string;
};
export type LoggerData = {
	onLog: ((data: any, info?: LogInfo) => any)[];
};
export const LoggerContext = createContext<LoggerData>();
export const LogProvider: ParentComponent<LoggerData> = (props) => {
	return (
		<LoggerContext.Provider
			value={{
				onLog: props.onLog,
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

export const log$ = <T,>(fn: () => T, metadata?: LogInfo) => {
	const ctx = useLoggerContext();
	createEffect(
		on(
			fn,
			(data) => {
				// Include extra deep tracking logic here in the future
				ctx.onLog.forEach((log) => log(data, metadata));
			},
			{ defer: true }
		)
	);
	// Do initial log
	const data = untrack(fn);
	ctx.onLog.forEach((log) => log(data, metadata));
};
