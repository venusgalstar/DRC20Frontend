export const trustLevelBadge = (level: any) => {
  if (level === 0) {
    return '/ticks/caution.png'
  }

  if (level === 2) {
    return '/ticks/verify.png'
  }

  return ''
}
