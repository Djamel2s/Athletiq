export const parseId = (value: string): number => {
  const id = parseInt(value, 10)
  if (isNaN(id) || id <= 0 || id > 2147483647) {
    throw new Error('Invalid ID')
  }
  return id
}
