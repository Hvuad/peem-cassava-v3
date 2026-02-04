import { useUserStore } from "./stores/user.store"
import { Login } from "./pages/Login"
import { NavbarCustom } from "./components/Navbar"

export default function App() {
	const userStore = useUserStore()
	if (!userStore.user) {
		return <Login />
	}
	return (
		<>
			<NavbarCustom />
			<div>xxx</div>
		</>
	)
}
