import { jwtVerify } from "jose"
import type { JWTPayload } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function verifyAuth(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export interface AuthPayload {
  userId: string
  email: string
  role: "STAFF" | "IT_OFFICER" | "ADMIN"
  iat: number
  exp: number
}
