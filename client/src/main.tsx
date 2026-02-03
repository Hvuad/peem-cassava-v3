import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { TanstackQuery } from "./providers/TanstackQuery.tsx"
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { ToastContainer } from "react-toastify"

// biome-ignore lint/style/noNonNullAssertion: <xxx>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<TanstackQuery>
			<App />
			<ToastContainer />
		</TanstackQuery>
	</StrictMode>,
)
