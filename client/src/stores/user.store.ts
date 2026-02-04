import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { api, InferResponseType } from "../lib/api"

interface State {
	user?: InferResponseType<typeof api.api.v1.auth.me.$get>
}
interface Action {
	setUser: (user: State["user"]) => void
}

export const useUserStore = create<State & Action>()(
	devtools(
		persist(
			(set) => ({
				user: undefined,
				setUser: (user) => set(() => ({ user })),
			}),
			{
				name: "user-storage",
			},
		),
	),
)
