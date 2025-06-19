import { requestAPI } from "@/lib/apiHelper"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    try {

        const cookieStore = await cookies()
        const refreshToken = cookieStore.get("refresh_token")?.value
        if (refreshToken) {
            try {
                await requestAPI<void>('post', '/auth/logout', { refreshToken }, { isPublic: false })
            } catch {
                // Kalau logout backend error, tetap lanjutkan proses
            }
        }

        const response = NextResponse.json({ message: "Logged out" })
        response.cookies.set({
            name: "token",
            value: "",
            maxAge: 0,
            path: "/",
        })
        response.cookies.set({
            name: "refresh_token",
            value: "",
            maxAge: 0,
            path: "/",
        })

        return response
    } catch {
        const response = NextResponse.json({ message: "Logged out" })
        response.cookies.set({
            name: "token",
            value: "",
            maxAge: 0,
            path: "/",
        })
        response.cookies.set({
            name: "refresh_token",
            value: "",
            maxAge: 0,
            path: "/",
        })

        return response
    }
}
