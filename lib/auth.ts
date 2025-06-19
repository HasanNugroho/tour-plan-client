import api from './api'
import { cookies } from 'next/headers'
import { decodeJWTPayload } from '@/utils/jwt'

export async function refreshAccessToken() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) return null

    try {
        const res = await api.post('/auth/refresh-token', {
            refreshToken,
        })

        const newAccessToken = res.data.data.access_token
        const newRefreshToken = res.data.data.refresh_token

        const accessPayload = decodeJWTPayload(newAccessToken)
        const refreshPayload = decodeJWTPayload(newRefreshToken)

        const now = Math.floor(Date.now() / 1000)
        const accessMaxAge = accessPayload?.exp ? accessPayload.exp - now : 60 * 15
        const refreshMaxAge = refreshPayload?.exp ? refreshPayload.exp - now : 60 * 60 * 24 * 7

            // Set cookie baru
            ; (await cookies()).set({
                name: 'token',
                value: newAccessToken,
                httpOnly: true,
                path: '/',
                maxAge: accessMaxAge,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            ; (await cookies()).set({
                name: 'token',
                value: newRefreshToken,
                httpOnly: true,
                path: '/',
                maxAge: refreshMaxAge,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

        return newAccessToken
    } catch (err) {
        console.error('[REFRESH_TOKEN_ERROR]', err)
        return null
    }
}
