/**
 * Parses a MySQL database URL to extract connection details.
 * Supports URLs like mysql://user:pass@host:port/db or mariadb://...
 * @param url The database URL string
 * @returns An object with host, port, user, password, database, and provider
 */
export function parseMySQLUrl(url: string): {
	host: string
	port: number
	user: string
	password: string
	database: string
	provider: "mysql" | "mariadb"
} {
	const urlPattern = /^(mysql|mariadb):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
	const match = url.match(urlPattern)
	if (!match) {
		throw new Error("Invalid database URL format")
	}
	const [, provider, user, password, host, portStr, database] = match
	return {
		host,
		port: parseInt(portStr, 10),
		user: decodeURIComponent(user),
		password: decodeURIComponent(password),
		database,
		provider: provider as "mysql" | "mariadb",
	}
}
