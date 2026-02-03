import { useUserStore } from "./stores/user.store"
import { Login } from "./pages/Login"

export default function App() {
	const userStore = useUserStore()
	if (!userStore.user) {
		return <Login />
	}
	return <div>{JSON.stringify(userStore.user, null, 4)}</div>
}
