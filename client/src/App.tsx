import { useQuery } from "@tanstack/react-query"
import { api } from "./lib/api"

export default function App() {
	const x = useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const res = await api.api.health.$get()
			return res.json()
		},
	})
	if (x.isLoading) return <div>Loading...</div>
	if (x.isError) return <div>Error: {(x.error as Error).message}</div>

	return <div>{x.data?.status}</div>
}
