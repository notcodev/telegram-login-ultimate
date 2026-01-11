export const buildUrl = (
  base: string,
  params: Record<string, boolean | number | string>,
): string => {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value.toString())
  }

  return `${base}?${searchParams.toString()}`
}
