import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { LogProvider } from "./components/LogContext";

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<LogProvider>
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
