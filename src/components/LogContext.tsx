import {
	createContext,
	createEffect,
	on,
	ParentComponent,
	untrack,
	useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
export type LogInfo = {
	line: number;
	file: string;
};
type LoggerFunction = (data: any, info?: LogInfo) => any;
type Logger = {
	runOn: "clientOnly" | "serverOnly" | "isomorphic";
	log: LoggerFunction;
};
export type LoggerData = {
	loggers: Logger[];
};
export const LoggerContext = createContext<LoggerData>();
export const LogProvider: ParentComponent<LoggerData> = (props) => {
	return (
		<LoggerContext.Provider value={{ loggers: props.loggers }}>
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
				ctx.loggers.forEach((logger) => logger.log(data, metadata));
			},
			{ defer: true }
		)
	);
	// Do initial log
	const data = untrack(fn);
	for (const logger of ctx.loggers) {
		const { runOn, log } = logger;
		if (runOn === "isomorphic") {
			log(data);
		} else if (runOn === "clientOnly" && !isServer) {
			log(data);
		} else if (runOn === "serverOnly" && isServer) {
			log(data);
		}
	}
};
