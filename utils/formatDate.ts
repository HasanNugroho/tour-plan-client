export function formatDate(iso: string, locale = "id-ID", tz = "Asia/Jakarta") {
    return new Date(iso).toLocaleString(locale, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: tz,
    })
}
