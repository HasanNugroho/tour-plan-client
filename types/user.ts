// types/user.ts
export interface Role {
    id: string
    name: string
    description: string
    permissions: string[]
    tenantId: string | null
    isSystem: boolean
    createdAt: string
    updatedAt: string
}

export interface profilePhoto {
    url: string
}

export interface UserProfile {
    id: string
    tenantId: string | null
    fullName: string
    username: string
    email: string
    roleId: string
    profilePhotoId: string | null
    profilePhoto?: profilePhoto
    isActive: boolean
    createdAt: string
    updatedAt: string
    role: Role
}
