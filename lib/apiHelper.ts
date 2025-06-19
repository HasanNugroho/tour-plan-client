"use server"

import api from './api'
import { cookies } from 'next/headers'
import { refreshAccessToken } from './auth'
import { AxiosRequestConfig } from 'axios'
import { redirect } from 'next/navigation'

type Method = 'get' | 'post' | 'put' | 'delete'

export async function requestAPI<T>(
    method: Method,
    url: string,
    paramsOrData?: Record<string, any>,
    options?: { isPublic?: boolean }
): Promise<T> {
    const isPublic = options?.isPublic ?? false
    const cookieStore = await cookies()

    const token = cookieStore.get('token')?.value
    const headers = {}

    if (!isPublic && token) {
        Object.assign(headers, { Authorization: `Bearer ${token}` })
    }

    const config: AxiosRequestConfig = {
        method,
        url,
        headers,
    }

    if (method === 'get') {
        config.params = paramsOrData
    } else {
        config.data = paramsOrData
    }

    try {
        // Request API pertama dengan token saat ini
        const response = await api.request<T>(config)

        return response.data
    } catch (error: any) {
        // Jika 401 dan bukan request public, coba refresh token
        if (error.response?.status === 401 && !isPublic) {
            const newToken = await refreshAccessToken()

            if (!newToken) {
                // Refresh token gagal, hapus cookie dan redirect login
                cookieStore.delete('token')
                cookieStore.delete('refresh_token')
                redirect('/login')
            }

            // Retry request dengan token baru
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` }
            const retryResponse = await api.request<T>({ ...config, headers: retryHeaders })

            return retryResponse.data
        }

        // Error lain lempar ke caller
        throw error
    }
}
