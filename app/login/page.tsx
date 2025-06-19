"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"
import { LoginFormSchema } from "./definitions"
import { saveUserToLocalStorage } from "@/lib/storage/user"
import { requestAPI } from "@/lib/apiHelper"
import { UserProfile } from "@/types/user"

export default function LoginPage() {
  const router = useRouter()

  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string[]; password?: string[] }>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const identifier = formData.get("identifier")
    const password = formData.get("password")

    const result = LoginFormSchema.safeParse({ identifier, password })

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors)
      return
    }

    try {
      // Panggil API route untuk login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setFormError(data.message || "Login failed")
        return
      }

      const userRes = await requestAPI<any>('get', '/auth/me', undefined, { isPublic: false })


      const userData = userRes.data
      console.log(userData)

      await saveUserToLocalStorage({
        profilePhotoUrl: userData.profilePhoto?.url ?? '',
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        role: userData.role.name,
        permissions: userData.role.permissions ?? [],
      })

      router.push("/dashboard")
    } catch (error) {
      setFormError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {formError && (
          <Alert variant="destructive" className="mb-2">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <LoginForm onSubmit={handleSubmit} errors={fieldErrors} />
      </div>
    </div>
  )
}
