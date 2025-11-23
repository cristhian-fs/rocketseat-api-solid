import { randomUUID } from "node:crypto"
import "dotenv/config"
import { Environment } from "vitest/environments"
import { execSync } from "node:child_process"

function generateDatabaseURL(schema: string) {
  const url = new URL(process.env.DATABASE_URL!)
  url.searchParams.set("schema", schema)
  return url.toString()
}

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseUrl

    // gera o client correto p/ este schema
    execSync("npx prisma db push")

    return {
      async teardown() {
        // importa o prisma somente depois do setup
        const { prisma } = await import("@/lib/prisma")
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      },
    }
  },
}
