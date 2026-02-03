import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 60 * 24, // 24 hours (previously cacheTime)
			retry: 0,
			refetchOnWindowFocus: false,
		},
	},
})

export const TanstackQuery = (props: React.PropsWithChildren) => {
	return <QueryClientProvider client={queryClient} {...props} />
}
