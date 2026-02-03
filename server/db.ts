import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"
import { parseMySQLUrl } from "./utils/mysql-utils"

const prismaClientSingleton = () => {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined in environment variables")
	}
	const url = parseMySQLUrl(process.env.DATABASE_URL) // Validate the URL format
	const adapter = new PrismaMariaDb({
		...url,
		connectionLimit: 20, // Increased from 5 to handle more concurrent connections
		connectTimeout: 100_000,
		idleTimeout: 30_000, // Close idle connections after 30s
	})

	return new PrismaClient({
		adapter,
		log: process.env.NODE_ENV !== "production" ? ["warn", "error"] : ["error"],
	})
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined
}

const db = globalForPrisma.prisma ?? prismaClientSingleton()

db.$connect()
	.then(async () => {
		console.log("Database connected")
	})
	.catch(console.error)

export { db }

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
