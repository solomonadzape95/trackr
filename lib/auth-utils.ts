import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import type { AuthPayload } from "./auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function getSession(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, secret)
    return verified.payload as AuthPayload
  } catch (err) {
    return null
  }
}

export function checkRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}
