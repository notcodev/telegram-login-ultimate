export const buildUrl = (
  base: string,
  params: Record<string, boolean | number | string>,
): string => {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, encodeURIComponent(value))
  }

  return `${base}?${searchParams.toString()}`
}
