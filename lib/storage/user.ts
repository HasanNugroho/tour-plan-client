const STORAGE_KEY = "app_user"
const SECRET_KEY = "ganti_dengan_kunci_32_karakter_rahasiamu"

// Fungsi util untuk encode/decode
function encode(text: string): Uint8Array {
    return new TextEncoder().encode(text)
}
function decode(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer)
}

async function getKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        "raw",
        encode(SECRET_KEY),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    )
}

export async function saveUserToLocalStorage(user: object) {
    // const iv = crypto.getRandomValues(new Uint8Array(12))

    // const key = await getKey()
    // const encoded = encode(JSON.stringify(user))

    // const ciphertext = await crypto.subtle.encrypt(
    //     { name: "AES-GCM", iv },
    //     key,
    //     encoded
    // )

    // const payload = {
    //     iv: Array.from(iv),
    //     data: Array.from(new Uint8Array(ciphertext)),
    // }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export async function getUserFromLocalStorage<T = any>(): Promise<T | null> {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)


    // try {
    //     const { iv, data } = JSON.parse(stored)
    //     const key = await getKey()

    //     const decrypted = await crypto.subtle.decrypt(
    //         { name: "AES-GCM", iv: new Uint8Array(iv) },
    //         key,
    //         new Uint8Array(data)
    //     )

    //     const json = decode(decrypted)
    //     return JSON.parse(json)
    // } catch (err) {
    //     console.error("Decryption failed:", err)
    //     return null
    // }
}

export function clearUserFromLocalStorage() {
    localStorage.removeItem(STORAGE_KEY)
}
