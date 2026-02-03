import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"

const queryClient = new QueryClient()

export const TanstackQuery = (props: React.PropsWithChildren) => {
	return <QueryClientProvider client={queryClient} {...props} />
}
