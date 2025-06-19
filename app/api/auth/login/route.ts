import { NextResponse } from 'next/server'
import { LoginFormSchema } from '@/app/login/definitions'
import api from '@/lib/api'
import { decodeJWTPayload } from '@/utils/jwt'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const parsed = LoginFormSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 })
        }

        const { identifier, password } = parsed.data

        // Send login request to backend API
        const res = await api.post('/auth/login', { identifier, password })
        const { access_token, refresh_token } = res.data.data

        // Decode token payloads to extract expiration
        const accessPayload = decodeJWTPayload(access_token)
        const refreshPayload = decodeJWTPayload(refresh_token)

        const now = Math.floor(Date.now() / 1000)
        const accessMaxAge = accessPayload?.exp ? accessPayload.exp - now : 60 * 15
        const refreshMaxAge = refreshPayload?.exp ? refreshPayload.exp - now : 60 * 60 * 24 * 7

        // Create response and set cookies
        const response = NextResponse.json({ message: 'Login successful' })

        response.cookies.set({
            name: 'token',
            value: access_token,
            httpOnly: true,
            path: '/',
            maxAge: accessMaxAge,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        response.cookies.set({
            name: 'refresh_token',
            value: refresh_token,
            httpOnly: true,
            path: '/',
            maxAge: refreshMaxAge,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        return response
    } catch (error: any) {
        console.error('[LOGIN_ERROR]', error)
        const msg = error?.response?.data?.message || 'Failed to login'
        return NextResponse.json({ message: msg }, { status: 401 })
    }
}
